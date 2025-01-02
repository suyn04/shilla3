const express = require("express");
const router = express.Router();
const conn = require("../db");


// module.exports = upload => {
router.get("/", async(req, res) => {
  const memberId = req.query.member_id;
  console.log("받은 memberId: ", memberId);

  if (!memberId) {
    return res.status(400).send("member_id가 제공되지 않았습니다.");
  }

  const query = `
    SELECT 
      r.reservation_id,
      r.start_date,
      r.end_date,
      r.adult_cnt,
      r.child_cnt,
      r.tot_price,
      p.product_id,
      p.room_id,
      rm.room_type,
      s.offer_name
    FROM reservation r
    LEFT JOIN product p ON r.product_id = p.product_id
    LEFT JOIN room rm ON p.room_id = rm.room_id
    LEFT JOIN specialoffer_pkg s ON p.offer_id = s.offer_id
    WHERE r.member_id = ?
      AND r.Cancel = 0;
  `;

  try {
    console.log("실행된 쿼리: ", query);

    // 데이터베이스 쿼리 실행
    const [rows] = await conn.execute(query, [memberId]);

    console.log("쿼리 결과: ", rows); // 쿼리 결과 로그 출력
    res.json(rows); // 클라이언트로 결과 반환
  } catch (error) {
    console.error("쿼리 오류:", error);
    res.status(500).send("DB 에러");
  }
});  

router.post('/cancel', async (req, res) => {
  const { reservationId, totPrice } = req.body;
  const today = new Date().toISOString().slice(0, 19).replace('T', ' ');

  console.log("받은 reservationId: ", reservationId);
  console.log("받은 totPrice: ", totPrice);

  if (!reservationId) {
    return res.status(400).send("reservationId가 제공되지 않았습니다.");
  }

  try {
    // reservation 테이블 업데이트
    const [reservationResult] = await conn.execute(
      `UPDATE reservation SET Cancel = 1 WHERE reservation_id = ?`,
      [reservationId]
    );

    if (reservationResult.affectedRows === 0) {
      throw new Error("reservation 업데이트 실패");
    }

    // payment 테이블 업데이트
    const [paymentResult] = await conn.execute(
      `UPDATE payment
       SET refund = '1',
           refund_date = ?,
           refund_amount = ?
       WHERE reservation_id = ?`,
      [today, totPrice, reservationId]
    );

    if (paymentResult.affectedRows === 0) {
      throw new Error("payment 업데이트 실패");
    }

    res.status(200).send("예약 및 결제가 취소되었습니다.");
  } catch (error) {
    console.error("예약 취소 중 오류 발생: ", error.message);

    res.status(500).send("예약 취소 처리 중 오류가 발생했습니다.");
  }
});

module.exports = router;
// };

import React from "react";
import { img, section, pkglist } from "./Eventdetaildata";
import EventDetail1_header from "./EventDetail1_header";
import EventDetail_con from "./EventDetail_con";
import EventDetail_des from "./EventDetail_des";
import EventDetail_othercard from "./EventDetail_othercard";

const EventDetail16 = () => {
    return (
        <div className="container">
            <div className="center">
                <EventDetail1_header title="Urban Cabana" />
                <EventDetail_con img={img[15]} section={section[15]} />
                <EventDetail_des />
                <EventDetail_othercard pkglist={pkglist.slice(15, 18)} />
            </div>
        </div>
    );
};

export default EventDetail16;

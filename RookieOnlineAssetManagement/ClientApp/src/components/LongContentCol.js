import React from "react";
import { Tooltip } from "bootstrap";
import { OverlayTrigger } from "react-bootstrap";
import { CompactString } from "utils";

const LongContentCol = ({ children }) => {
    return (
        <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="button-tooltip-2">{children}</Tooltip>}
        >
            {({ ref, ...triggerHandler }) => (
                <span {...triggerHandler} ref={ref}>
                    {CompactString(children)}
                </span>
            )}
        </OverlayTrigger>
    );
};

export default LongContentCol;
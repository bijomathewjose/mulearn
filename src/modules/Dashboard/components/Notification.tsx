import { useState } from "react";
import "./Notification.css";
import {
    clearAllNotifications,
    clearNotification,
    getNotifications,
    Notification as NotificationProps,
    requestApproval
} from "./api";
import { IoIosClose } from "react-icons/io";
import { MdRefresh } from "react-icons/md";
import dpm from "../assets/images/dpm.webp";
import { filterNotification, getTimeAgo, isRequest } from "./utils";
import toast from "react-hot-toast";

interface NotificationComponentProps {
    notificationList: NotificationProps[];
    setNotificationList: React.Dispatch<
        React.SetStateAction<NotificationProps[]>
    >;
}

const NotificationMessage = ({
    profile,
    title,
    created_at,
    description,
    clearElementFromView,
    id,
    url,
    updateList,
    created_by
}: NotificationMessageProps) => {
    const props = {
        updateList: updateList,
        clearElementFromView: clearElementFromView
    };
    return (
        <div className="notiMessageTab">
            <img src={profile || dpm} alt="" />
            <div className="notiMessageProfile">
                <b>{title}</b>
                <span
                    className="blueDot"
                    onClick={() => clearNotification(id, props)}
                >
                    <IoIosClose size={"18px"} />
                </span>
                <div className="day">
                    {new Date(created_at).toLocaleDateString("en-US", {
                        day: "numeric",
                        weekday: "long",
                        hour12: true,
                        hour: "numeric",
                        minute: "numeric"
                    })}
                    <b>{getTimeAgo(created_at, new Date())}</b>
                </div>
                <p>{description}</p>
                {isRequest(title) && (
                    <div className="btns">
                        <button
                            onClick={() => {
                                requestApproval(
                                    id,
                                    url,
                                    created_by,
                                    false,
                                    props
                                );
                                clearNotification(id, props);
                            }}
                        >
                            Decline
                        </button>
                        &nbsp;
                        <button
                            className="accept"
                            onClick={() => {
                                requestApproval(
                                    id,
                                    url,
                                    created_by,
                                    true,
                                    props
                                );
                                clearNotification(id, props);
                            }}
                        >
                            Accept
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const NotificationTab = ({
    notificationList,
    setNotificationList
}: NotificationComponentProps) => {
    const [active, setActive] = useState(0);
    const links = [{ title: "View All", count: notificationList.length }];

    const filteredNotification = filterNotification(active, notificationList);

    const clearElementFromView = (id: string) =>
        setNotificationList(notificationList =>
            notificationList.filter(item => item.id !== id)
        );

    const clearAll = () => {
        if (notificationList.length > 0) {
            setNotificationList([]);
            clearAllNotifications({
                setNotificationList: setNotificationList
            });
        } else {
            toast.error("No notifications to clear");
        }
    };

    return (
        <div className="yourNotification">
            <div className="notiTop">
                <b>Your Notification</b>
                <div className="clearAll" onClick={clearAll}>
                    ✖ Clear all
                </div>
                <div
                    className="clearAll"
                    onClick={() => getNotifications(setNotificationList)}
                >
                    <MdRefresh size={20} />
                </div>
            </div>
            <div className="notiMessageContainer">
                {filteredNotification.length > 0 ? (
                    <div className="notiMessage">
                        {filteredNotification.map((item, index) => (
                            <div key={item?.id}>
                                <NotificationMessage
                                    key={index}
                                    {...item}
                                    clearElementFromView={() =>
                                        clearElementFromView(item?.id)
                                    }
                                    updateList={() =>
                                        getNotifications(setNotificationList)
                                    }
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="nothing">
                        You're on track! <br />
                        No pending notifications at the moment.
                    </div>
                )}
            </div>
        </div>
    );
};

interface NotificationMessageProps extends NotificationProps {
    clearElementFromView: () => void;
    profile?: string;
    updateList: () => void;
}

export default NotificationTab;

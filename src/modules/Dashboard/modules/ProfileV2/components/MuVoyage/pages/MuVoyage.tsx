import { useState } from "react";
import styles from "./MuVoyage.module.css";
import discordicon from "../assets/images/discordicon.webp";
import {
    Progress,
    CircularProgress,
    CircularProgressLabel
} from "@chakra-ui/react";
import Roket from "../assets/images/svg/Roket";
import { userLevelBadge } from "../../../../../utils/utils";

type Props = {
    userLevelData: {
        karma: number;
        name: string;
        tasks: {
            task_name: string;
            discord_link: string;
            completed: boolean;
            hashtag: string;
            karma: number;
        }[];
    }[];
    userLevel: number;
};

const MuVoyage = (props: Props) => {
    const [userLevelData, setUserLevelData] = useState(props.userLevelData);
    const [userLevelTrack, setUserLevelTrack] = useState(
        userLevelData[props.userLevel - 1]
    );

    let userLevelTrackerPercentage = "0";

    if (userLevelTrack) {
        // Check if userLevelTrack is defined
        userLevelTrackerPercentage = !userLevelTrack?.tasks.every(
            e => e.completed
        )
            ? `${(
                  (userLevelTrack?.tasks.filter(e => e.completed).length /
                      userLevelTrack?.tasks.length) *
                  100
              ).toFixed(0)}`
            : "100";
    }

    console.log(props.userLevelData);
    return (
        <>
            {userLevelTrack && (
                <div className={styles.main_task}>
                    {/* <p className={styles.rocket}>
                        <Roket />
                    </p> */}
                    <div className={styles.tasks}>
                        <div className={styles.topSection}>
                            <div className={styles.title}>
                                <span>
                                    <img
                                        src={userLevelBadge(props.userLevel)}
                                        alt={`Level ${props.userLevel}`}
                                    />
                                    {/* <img src={level1} alt="" /> */}
                                </span>
                                <div className={styles.title_desc}>
                                    <p>{userLevelTrack?.name}</p>
                                    {/* <p>Level2 - Task 1</p> */}
                                </div>
                            </div>

                            {userLevelTrack.name !== "lvl4" && (
                                <div className={styles.progressbar}>
                                    <div className={styles.progress_title}>
                                        <p>
                                            {userLevelTrackerPercentage + "%"}{" "}
                                            complete
                                        </p>
                                        <p>
                                            {userLevelTrack?.tasks
                                                .filter(e => e.completed)
                                                .reduce(
                                                    (a, b) => a + b.karma,
                                                    0
                                                )}
                                            /
                                            {userLevelTrack?.tasks.reduce(
                                                (a, b) => a + b.karma,
                                                0
                                            )}{" "}
                                            Karma
                                        </p>
                                    </div>
                                    <Progress
                                        value={parseInt(
                                            userLevelTrackerPercentage
                                        )}
                                        size="xs"
                                        colorScheme="green"
                                        borderRadius="10px"
                                    />
                                </div>
                            )}

                            <div className={styles.date}>
                                {/* <p>Start: Nov 12</p> */}
                                {/* <p>End: Dec 12</p> */}
                            </div>
                        </div>

                        <ul className={styles.accordion}>
                            {userLevelData
                                .filter(e => e?.tasks.length !== 0)
                                .map((levelData, i) => {
                                    return (
                                        <li
                                            className={styles.main_list}
                                            key={i}
                                        >
                                            <input
                                                className={styles.expandBtn}
                                                type="checkbox"
                                                name="accordion"
                                                id={`accordion_${i}`}
                                            />
                                            <label
                                                htmlFor={`accordion_${i}`}
                                                className={styles.level}
                                            >
                                                <p>
                                                    {levelData?.name}
                                                    {"  "}
                                                    <span
                                                        className={
                                                            styles.level_karma_detail
                                                        }
                                                    >
                                                        [
                                                        {levelData?.tasks
                                                            .filter(
                                                                e => e.completed
                                                            )
                                                            .reduce(
                                                                (a, b) =>
                                                                    a + b.karma,
                                                                0
                                                            )}
                                                        /
                                                        <span
                                                            style={{
                                                                color: "#2E85FE"
                                                            }}
                                                        >
                                                            {levelData.tasks.reduce(
                                                                (a, b) =>
                                                                    a + b.karma,
                                                                0
                                                            )}
                                                        </span>
                                                        ]
                                                    </span>
                                                </p>
                                                <div
                                                    className={
                                                        styles.task_details
                                                    }
                                                >
                                                    <CircularProgress
                                                        value={
                                                            !levelData?.tasks.every(
                                                                e => e.completed
                                                            )
                                                                ? (levelData?.tasks.filter(
                                                                      e =>
                                                                          e.completed
                                                                  ).length /
                                                                      levelData
                                                                          ?.tasks
                                                                          .length) *
                                                                  100
                                                                : 100
                                                        }
                                                        color="green.400"
                                                        thickness="12px"
                                                        size="15px"
                                                        capIsRound={true}
                                                        // trackColor="red.100"
                                                    >
                                                        {levelData?.tasks.every(
                                                            e => e.completed
                                                        ) ? (
                                                            <CircularProgressLabel>
                                                                <i
                                                                    className={`fi fi-ss-check-circle ${styles.tick}`}
                                                                ></i>
                                                            </CircularProgressLabel>
                                                        ) : null}
                                                    </CircularProgress>
                                                    <p>
                                                        {
                                                            levelData?.tasks
                                                                .length
                                                        }{" "}
                                                        Tasks
                                                    </p>
                                                    <i
                                                        className={`fi fi-br-angle-down ${styles.icon_down_arrow}`}
                                                    ></i>
                                                </div>
                                            </label>
                                            <div className={styles.content}>
                                                <div
                                                    className={
                                                        styles.goal_container
                                                    }
                                                >
                                                    <p>
                                                        Mine Left:{" "}
                                                        {Math.max(
                                                            levelData.karma -
                                                                levelData?.tasks
                                                                    .filter(
                                                                        e =>
                                                                            e.completed
                                                                    )
                                                                    .reduce(
                                                                        (
                                                                            a,
                                                                            b
                                                                        ) =>
                                                                            a +
                                                                            b.karma,
                                                                        0
                                                                    ),
                                                            0
                                                        )}{" "}
                                                        Karma
                                                    </p>
                                                    <p className={styles.goal}>
                                                        <i className="fi fi-sr-bullseye-arrow"></i>{" "}
                                                        Goal: {levelData.karma}{" "}
                                                        Karma
                                                    </p>
                                                </div>
                                                <ul
                                                    className={styles.list_list}
                                                >
                                                    {levelData?.tasks &&
                                                        levelData?.tasks.map(
                                                            (taskData, j) => {
                                                                return (
                                                                    <li key={j}>
                                                                        <input
                                                                            type="checkbox"
                                                                            name="accordion"
                                                                            id={`task_${i}_${j}`}
                                                                            className={
                                                                                styles.checkbox
                                                                            }
                                                                            checked={
                                                                                taskData.completed
                                                                            }
                                                                            readOnly
                                                                        />
                                                                        <label
                                                                            htmlFor={`task_${i}_${j}`}
                                                                            className={
                                                                                styles.first1
                                                                            }
                                                                        >
                                                                            {
                                                                                taskData.task_name
                                                                            }
                                                                            <a
                                                                                href={
                                                                                    taskData.discord_link
                                                                                }
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                            >
                                                                                <span>
                                                                                    {
                                                                                        taskData.hashtag
                                                                                    }
                                                                                    <a
                                                                                        href={
                                                                                            taskData.discord_link
                                                                                        }
                                                                                        className={
                                                                                            styles.discordContainer
                                                                                        }
                                                                                    >
                                                                                        <img
                                                                                            src={
                                                                                                discordicon
                                                                                            }
                                                                                            className={
                                                                                                styles.discord
                                                                                            }
                                                                                            alt="discord"
                                                                                        ></img>
                                                                                    </a>
                                                                                </span>
                                                                            </a>

                                                                            <p>
                                                                                {taskData.karma +
                                                                                    " ϰ"}
                                                                            </p>
                                                                        </label>
                                                                    </li>
                                                                );
                                                            }
                                                        )}
                                                </ul>
                                            </div>
                                        </li>
                                    );
                                })}
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
};

export default MuVoyage;

import styles from "./Table.module.css";
import { RxCaretSort } from "react-icons/rx";
import { BiSortAlt2 } from "react-icons/bi";
import { ReactElement } from "react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { Data } from "./Table";

interface TableHeadProps {
    columnOrder: {
        column: string;
        Label: string;
        isSortable: boolean;
        wrap?: (
            data: string | ReactElement,
            id: string,
            row: Data
        ) => ReactJSXElement;
    }[];
    onIconClick: (column: string) => void;
    action?: true | false;
    verify?: true | false;
}

const THead: React.FC<TableHeadProps> = ({
    columnOrder,
    onIconClick,
    action = false,
    verify = false
}) => {
    return (
        <thead>
            <tr>
                <th className={styles.th}>Sl.no</th>
                {columnOrder.map((column, index) => (
                    <th className={styles.th} key={column.column}>
                        <div className={styles.thContainer}>
                            <span>{column.Label}</span>
                            {column.isSortable && (
                                <button
                                    className={styles.icon}
                                    onClick={() => onIconClick(column.column)}
                                >
                                    <BiSortAlt2 />
                                </button>
                            )}
                        </div>
                    </th>
                ))}
                {verify && <th className={styles.th}>Verify</th>}
                {action && <th className={styles.th}>Action</th>}
            </tr>
        </thead>
    );
};

export default THead;

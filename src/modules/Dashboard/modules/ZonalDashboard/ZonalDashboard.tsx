import Pagination from "@/MuLearnComponents/Pagination/Pagination";
import THead from "@/MuLearnComponents/Table/THead";
import Table, { Data } from "@/MuLearnComponents/Table/Table";
import TableTop from "@/MuLearnComponents/TableTop/TableTop";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getzonaldashboard, getTopDistrict, getStudentLevels } from "./apis";
import { columnsStudent, columnsCampus } from "./THeaders";
import TableTopTab from "./TableTopTab";
import "./ZonalDashboard.css";
import { dashboardRoutes } from "@/MuLearnServices/urls";
import { BarChart, ColumnChart } from "../CampusStudentList/Components/Graphs";
import graphStyles from "../CampusStudentList/pages/CampusStudentList.module.css";
import { Blank } from "@/MuLearnComponents/Table/Blank";
import toast from "react-hot-toast";

function ZonalDashboard() {
    const [data, setData] = useState<Data[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [perPage, setPerPage] = useState(20);
    const [columns, setColumns] = useState(columnsStudent);
    const [activeTab, setActiveTab] = useState("Student management");
    const [sort, setSort] = useState("");
    const [popupStatus, setPopupStatus] = useState(false);
    const firstFetch = useRef(true);
    const [isCreate, setIsCreate] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    //graph data
    const [colData, setColData] = useState<string[][] | null>(null);
    const [barData, setBarData] = useState<string[][] | null>(null);

    const navigate = useNavigate();

    const errHandler = (err: any) => {
        toast.error("Data fetch failed");
    };

    useEffect(() => {
        if (firstFetch.current) {
            (async () => {
                setBarData(await getTopDistrict(errHandler));
                setColData(
                    [
                        ["Levels", "Level 1", "Level 2", "Level 3", "Level 4"]
                    ].concat(await getStudentLevels(errHandler))
                );
            })();

            getzonaldashboard(
                activeTab,
                setData,
                1,
                perPage,
                setTotalPages,
                "",
                ""
            );
        }
        firstFetch.current = false;
    }, []);
    const handleNextClick = () => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        // getzonaldashboard(activeTab, setData, nextPage, perPage);
    };

    const handlePreviousClick = () => {
        const prevPage = currentPage - 1;
        setCurrentPage(prevPage);
        // getzonaldashboard(activeTab, setData, prevPage, perPage);
    };

    const handleSearch = (search: string) => {
        setCurrentPage(1);
        getzonaldashboard(
            activeTab,
            setData,
            1,
            perPage,
            setTotalPages,
            search,
            ""
        );
    };

    const handlePerPageNumber = (selectedValue: number) => {
        setCurrentPage(1);
        setPerPage(selectedValue);
    };

    const handleTabClick = (tab: string) => {
        if (tab === "Student management") {
            setColumns(columnsStudent);
            getzonaldashboard(tab, setData, 1, perPage, setTotalPages, "", "");
        } else if (tab === "Campus management") {
            setColumns(columnsCampus);
            getzonaldashboard(tab, setData, 1, perPage, setTotalPages, "", "");
        } else {
            alert("Error to load Table Headers");
        }
        setCurrentPage(1);
        setActiveTab(tab);
        setPopupStatus(false);
    };

    const handleIconClick = (column: string) => {
        if (column === "total_karma") {
            column = "karma"; //temp fix
        }
        if (column === "fullname") {
            column = "first_name"; //temp fix
        }
        if (sort === column) {
            setSort(`-${column}`);
        } else {
            setSort(column);
        }
    };

    useEffect(() => {
        getzonaldashboard(
            activeTab,
            setData,
            currentPage,
            perPage,
            setTotalPages,
            "",
            sort
        );
    }, [sort, currentPage, perPage]);

    const CSV = (tabname: string) => {
        if (
            activeTab === "Student management" &&
            tabname === "Student management"
        ) {
            return dashboardRoutes.zonalStudentData;
        }
        if (
            activeTab === "Campus management" &&
            tabname === "Campus management"
        ) {
            return dashboardRoutes.zonalCampusData;
        }
    };
    return (
        <>
            <TableTopTab
                active={activeTab}
                onTabClick={handleTabClick}
                tabletopTab={["Student management", "Campus management"]}
            />
            <div className={graphStyles.graphs}>
                <div className={graphStyles.container}>
                    <h2>Top 3 Districts</h2>
                    <BarChart
                        data={barData}
                        ylabel="Karma"
                        addOptions={{
                            legend: { position: "none" },
                            colors: ["#91ABFF"]
                        }}
                    />
                </div>
                <div className={graphStyles.container}>
                    <h2>Student Level Stats</h2>
                    <ColumnChart
                        data={colData}
                        addOptions={{
                            axes: {
                                y: {
                                    0: { label: "No of Students" }
                                }
                            },
                            pieSliceText: "value",
                            colors: [
                                "#3B57B2",
                                "#456FF6",
                                "#A9BEFF",
                                "#6C8FFF",
                                "#A9BEFF"
                            ]
                        }}
                    />
                </div>
            </div>

            {data && (
                <>
                    <TableTop
                        onSearchText={handleSearch}
                        onPerPageNumber={handlePerPageNumber}
                        CSV={CSV(activeTab)}
                    />
                    <Table
                        rows={data}
                        page={currentPage}
                        perPage={perPage}
                        columnOrder={columns}
                        id={["code"]}
                    >
                        <THead
                            columnOrder={columns}
                            onIconClick={handleIconClick}
                        />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            margin="10px 0"
                            handleNextClick={handleNextClick}
                            handlePreviousClick={handlePreviousClick}
                            perPage={perPage}
                            setPerPage={handlePerPageNumber as any}
                        />
                        <Blank />
                    </Table>
                </>
            )}
        </>
    );
}

export default ZonalDashboard;

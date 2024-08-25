import Pagination from "@/MuLearnComponents/Pagination/Pagination";
import THead from "@/MuLearnComponents/Table/THead";
import Table from "@/MuLearnComponents/Table/Table";
import TableTop from "@/MuLearnComponents/TableTop/TableTop";
import { useEffect, useRef, useState } from "react";
import { BarChart, ColumnChart } from "../CampusStudentList/Components/Graphs";
import { getdistrictdashboard, getStudentLevels, getTopCampus } from "./apis";
import { columnsCampus, columnsStudent } from "./THeaders";
import { dashboardRoutes } from "@/MuLearnServices/urls";
import "./Organizations.css";
import "./DistricDashboard.scss";
import TableTopTab from "./TableTopTab";
import graphStyles from "../CampusStudentList/pages/CampusStudentList.module.css";
import { Blank } from "@/MuLearnComponents/Table/Blank";
import toast from "react-hot-toast";

function DistrictDashboard() {
    const [data, setData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [perPage, setPerPage] = useState(20);
    const [columns, setColumns] = useState(columnsStudent);
    const [activeTab, setActiveTab] = useState("Student management");
    const [sort, setSort] = useState("");

    const firstFetch = useRef(true);

    //graph data
    const [colData, setColData] = useState<string[][] | null>(null);
    const [barData, setBarData] = useState<string[][] | null>(null);

    const errHandler = (err: any) => {
        toast.error("Data Fetch Failed");
        toast.error(err);
    };

    useEffect(() => {
        if (firstFetch.current) {
            getdistrictdashboard(
                activeTab,
                setData,
                1,
                perPage,
                setTotalPages,
                "",
                ""
            );

            (async () => {
                setBarData(await getTopCampus(errHandler));
                setColData(
                    [
                        ["Levels", "Level 1", "Level 2", "Level 3", "Level 4"]
                    ].concat(await getStudentLevels(errHandler))
                );
            })();
        }
        firstFetch.current = false;
    }, []);

    const handleNextClick = () => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
    };

    const handlePreviousClick = () => {
        const prevPage = currentPage - 1;
        setCurrentPage(prevPage);
    };

    const handleSearch = (search: string) => {
        setCurrentPage(1);
        getdistrictdashboard(
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
            getdistrictdashboard(
                tab,
                setData,
                1,
                perPage,
                setTotalPages,
                "",
                ""
            );
        } else if (tab === "Campus management") {
            setColumns(columnsCampus);
            getdistrictdashboard(
                tab,
                setData,
                1,
                perPage,
                setTotalPages,
                "",
                ""
            );
        } else {
            alert("Error to load Table Headers");
        }
        setCurrentPage(1);
        setActiveTab(tab);
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

    const CSV = (tabname: string) => {
        if (
            activeTab === "Student management" &&
            tabname === "Student management"
        ) {
            return dashboardRoutes.districtStudentData;
        }
        if (
            activeTab === "Campus management" &&
            tabname === "Campus management"
        ) {
            return dashboardRoutes.districtCampusData;
        }
    };

    useEffect(() => {
        getdistrictdashboard(
            activeTab,
            setData,
            currentPage,
            perPage,
            setTotalPages,
            "",
            sort
        );
    }, [sort, currentPage, perPage]);

    return (
        <>
            <TableTopTab active={activeTab} onTabClick={handleTabClick} />
            <div className={graphStyles.graphs}>
                <div className={graphStyles.container}>
                    <h2>Top 3 Campus</h2>
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

export default DistrictDashboard;

import styles from "./NotFound.module.css";
import stone from "./assests/NotFound/Stone.webp";
import fourNotFour from "./assests/NotFound/FourNotFour.webp";
import NoBgFourNotFour from "./assests/NotFound/NoBgFourNotFour.webp";
import smallRocks from "./assests/NotFound/SmallRocks.webp";

const NotFound = () => {
    return (
        <div className={styles.container_404}>
            <div className={styles.NotBg}></div>

            <div className={styles.Notbox}>
                <div className={styles.Notfirst}>
                    <div className={styles.uh}>uh,</div>
                    <div className={styles.oh}>Oh!</div>
                    <span>
                        <div className={styles.you}>you</div>
                        <div className={styles.ve}>'ve</div>
                    </span>
                </div>
                <div className={styles.Notsecond}>
                    <div className={styles.l}>l</div>
                    <img className={styles.o} src={stone} alt="stone" />
                    <div className={styles.s}>s</div>
                    <div className={styles.t}>t</div>
                </div>
                <div className={styles.Notthird}>
                    <div className={styles.in}>in</div>
                    <div className={styles.space}>space </div>
                </div>
            </div>

            <img
                className={styles.NotFoundUfo}
                src="https://i.ibb.co/CQDjhGP/ufo.png"
                alt=""
            />

            <img className={styles.NotFound404} src={fourNotFour} alt="" />

            <img className={styles.NotFoundRocks} src={smallRocks} alt="" />

            <img className={styles.NotFoundMars} src={NoBgFourNotFour} alt="" />
        </div>
    );
};

export default NotFound;

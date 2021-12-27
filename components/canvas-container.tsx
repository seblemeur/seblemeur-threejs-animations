import styles from "../styles/CanvasContainer.module.css";

const CanvasContainer = (props: any) => {
  return (
    <div className={styles.CanvasContainer}>
      <div className={styles.CanvasContainerInner}>{props.children}</div>
    </div>
  );
};

export default CanvasContainer;

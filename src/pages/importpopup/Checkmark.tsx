import styles  from './Checkmark.module.css';

const Checkmark = () => {
  return (
    <div class={styles.checkmarkContainer}>
      <svg class={styles.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
        <circle class={styles.checkmarkCircle} cx="26" cy="26" r="25" fill="none"/>
        <path class={styles.checkmarkCheck} fill="none" d="M14 27l7 7 17-17"/>
      </svg>
    </div>
  );
};

export default Checkmark;

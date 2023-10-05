type Props = {
  enableClick: boolean;
};
export const Test = ({ enableClick }: Props) => {
  return (
    <button disabled={enableClick} type="button">
      點我
    </button>
  );
};

const WithCondition = ({ when, then, or }) => {
  return when ? then : or;
};

export default WithCondition;

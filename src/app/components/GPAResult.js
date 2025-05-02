const GPAResult = ({ calculateCGPA, requiredGPA, requiredGPAList }) => {
  return (
    <div className="mb-4">
      <h2 className="font-semibold">Current CGPA: </h2>
      <p>{calculateCGPA() ? calculateCGPA().toFixed(2) : "0.00"}</p>
      {requiredGPA && requiredGPAList.length > 0 && (
        <div>
          <h2 className="font-semibold">Required GPA in Each Remaining Subject:</h2>
          <ul>
            {requiredGPAList.map((subject, index) => (
              <li key={index}>
                {subject.name}: <strong>{subject.requiredGPA.toFixed(2)}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GPAResult;

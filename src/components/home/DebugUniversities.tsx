import { universities } from '../../data/universities';

export default function DebugUniversities() {
  console.log('Debug - Universities array length:', universities.length);
  console.log('Debug - Universities:', universities.map(u => ({ id: u.id, name: u.name })));

  return (
    <div className="p-4 bg-yellow-100 border-2 border-yellow-500">
      <h2 className="text-xl font-bold mb-4">Debug: Universities Data</h2>
      <p>Total universities: {universities.length}</p>
      <ul className="list-disc pl-6">
        {universities.map((university) => (
          <li key={university.id}>
            {university.id}: {university.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

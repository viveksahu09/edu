import { Plus, GraduationCap, BookOpen } from 'lucide-react';

interface EmptyStateProps {
  type: 'university' | 'degree' | 'course' | 'subject' | 'notes';
  onAdd?: () => void;
  canAdd?: boolean;
}

export default function EmptyState({ type, onAdd, canAdd = false }: EmptyStateProps) {
  const getEmptyStateConfig = () => {
    switch (type) {
      case 'university':
        return {
          icon: GraduationCap,
          title: 'No universities found',
          description: 'Be the first to add a university to the system!',
          actionText: 'Add University'
        };
      case 'degree':
        return {
          icon: GraduationCap,
          title: 'No degrees found',
          description: 'Start by adding degree programs for this university.',
          actionText: 'Add Degree'
        };
      case 'course':
        return {
          icon: BookOpen,
          title: 'No courses found',
          description: 'Add courses to organize your academic programs.',
          actionText: 'Add Course'
        };
      case 'subject':
        return {
          icon: BookOpen,
          title: 'No subjects found',
          description: 'Add subjects to populate this course with content.',
          actionText: 'Add Subject'
        };
      case 'notes':
        return {
          icon: BookOpen,
          title: 'No notes found',
          description: 'Be the first to contribute study materials!',
          actionText: 'Add Notes'
        };
      default:
        return {
          icon: BookOpen,
          title: 'Nothing found',
          description: 'No content available yet.',
          actionText: 'Add Content'
        };
    }
  };

  const config = getEmptyStateConfig();
  const Icon = config.icon;

  return (
    <div className="text-center py-12 px-4">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Icon className="w-12 h-12 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {config.title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {config.description}
      </p>
      
      {canAdd && onAdd && (
        <button
          onClick={onAdd}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          {config.actionText}
        </button>
      )}
    </div>
  );
}

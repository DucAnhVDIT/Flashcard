import { FolderList } from '@/components/FolderList';

export default function FoldersPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Folders</h1>
      <FolderList />
    </main>
  );
}
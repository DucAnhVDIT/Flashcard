import { SetStateAction, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Folder } from '@/types/types';


export function FolderList() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [newFolderName, setNewFolderName] = useState('');

  const createFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: Folder = {
        id: Date.now().toString(),
        name: newFolderName.trim(),
        flashcards: [],
      };
      setFolders([...folders, newFolder]);
      setNewFolderName('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="New folder name"
          value={newFolderName}
          onChange={(e: { target: { value: SetStateAction<string>; }; }) => setNewFolderName(e.target.value)}
        />
        <Button onClick={createFolder}>Create Folder</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {folders.map((folder) => (
          <Card key={folder.id}>
            <CardHeader>
              <CardTitle>{folder.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{folder.flashcards.length} flashcards</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
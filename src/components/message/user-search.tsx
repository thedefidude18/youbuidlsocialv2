"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { orbis } from "@/lib/orbis";
import { Loader2 } from "lucide-react";

interface User {
  did: string;
  username: string;
  details: {
    profile?: {
      username?: string;
      pfp?: string;
    }
  }
}

interface UserSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (user: User) => void;
}

export function UserSearch({ isOpen, onClose, onSelectUser }: UserSearchProps) { 
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && searchQuery.length >= 2) {
      searchUsers();
    }
  }, [searchQuery, isOpen]);

  const searchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Using correct Orbis API method
      const { data, error } = await orbis.getPosts({
        algorithm: "all-posts",
        tag: "profile",
        only_master: true
      });
      
      if (error) throw new Error(error.message);
      
      // Filter users based on search query
      const filteredUsers = data
        .filter(user => 
          user.content?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.did?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 10);
      
      setUsers(filteredUsers);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>
        <Command>
          <CommandInput
            placeholder="Search users..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {isLoading ? (
              <div className="p-4 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
              </div>
            ) : error ? (
              <div className="p-4 text-center text-destructive">
                {error}
              </div>
            ) : users.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                {searchQuery.length < 2 ? 'Type to search users' : 'No users found'}
              </div>
            ) : (
              users.map(user => (
                <CommandItem
                  key={user.did}
                  onSelect={() => {
                    onSelectUser(user);
                    onClose();
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage 
                        src={user.content?.pfp} 
                        alt={user.content?.username || user.did} 
                      />
                      <AvatarFallback>
                        {(user.content?.username || user.did).charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {user.content?.username || user.did.slice(0, 10)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.did.slice(0, 20)}...
                      </p>
                    </div>
                  </div>
                </CommandItem>
              ))
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}



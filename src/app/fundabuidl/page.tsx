'use client';

import { DebugDonateModal } from '@/components/debug-donate-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

const mockAuthor = {
  name: "Test Builder",
  username: "testbuilder",
  avatar: "https://avatars.githubusercontent.com/u/1234567?v=4",
  address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e" // Example address
};

const mockStreamId = "test-stream-123";
const mockPostExcerpt = "This is a test post to verify the donation system...";

export default function Fundabuidl() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Fundabuidl</h1>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Test Donation System</CardTitle>
            <CardDescription>
              This is a test page to verify the donation system functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Test Configuration:</h3>
                <pre className="text-sm overflow-x-auto">
                  {JSON.stringify({
                    contractAddress: process.env.NEXT_PUBLIC_DONATION_CONTRACT_ADDRESS,
                    author: mockAuthor,
                    streamId: mockStreamId
                  }, null, 2)}
                </pre>
              </div>
              
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="w-full"
              >
                Open Donation Modal
              </Button>
            </div>
          </CardContent>
        </Card>

        <DebugDonateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          author={mockAuthor}
          streamId={mockStreamId}
          postExcerpt={mockPostExcerpt}
        />
      </div>
    </div>
  );
}

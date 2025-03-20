import axios from 'axios';

export class IPFSService {
  private baseURL: string;
  private jwt: string;
  private gatewayUrl: string;

  constructor() {
    this.baseURL = 'https://api.pinata.cloud';
    this.jwt = process.env.NEXT_PUBLIC_PINATA_JWT || '';
    this.gatewayUrl = process.env.NEXT_PUBLIC_GATEWAY_URL || '';
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.jwt}`
    };
  }

  getGatewayUrl(ipfsHash: string): string {
    return `https://${this.gatewayUrl}/ipfs/${ipfsHash}`;
  }

  async uploadImage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('pinataMetadata', JSON.stringify({
        name: `image-${Date.now()}`
      }));
      formData.append('pinataOptions', JSON.stringify({
        cidVersion: 1
      }));

      const response = await axios.post(
        `${this.baseURL}/pinning/pinFileToIPFS`,
        formData,
        {
          headers: {
            ...this.getHeaders(),
            'Content-Type': 'multipart/form-data'
          },
          maxBodyLength: Infinity
        }
      );

      return response.data.IpfsHash;
    } catch (error) {
      console.error('Error uploading image to IPFS:', error);
      throw error;
    }
  }

  async uploadPost(postData: {
    content: string;
    images?: string[];
    timestamp: string;
    hashtags: string[];
  }) {
    try {
      const response = await axios.post(
        `${this.baseURL}/pinning/pinJSONToIPFS`,
        {
          pinataContent: postData,
          pinataMetadata: {
            name: `post-${Date.now()}`
          },
          pinataOptions: {
            cidVersion: 1
          }
        },
        { 
          headers: this.getHeaders(),
          maxBodyLength: Infinity
        }
      );
      return response.data.IpfsHash;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw error;
    }
  }
}



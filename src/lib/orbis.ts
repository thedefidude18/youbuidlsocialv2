import { Orbis } from "@orbisclub/orbis-sdk";

export const orbis = new Orbis({
    useLit: false,
    node: "https://node2.orbis.club",
    PINATA_GATEWAY: 'https://gateway.pinata.cloud/ipfs/',
    CERAMIC_NODE: "https://node2.orbis.club"
});

// Initialize Orbis connection
export const initializeOrbis = async () => {
  try {
    const res = await orbis.isConnected();

    if (!res || !res.status) {
      console.log('Connecting to Orbis...');
      const connectRes = await orbis.connect();

      if (!connectRes.status) {
        throw new Error('Failed to connect to Orbis');
      }
    }

    return true;
  } catch (error) {
    console.error('Error initializing Orbis:', error);
    return false;
  }
};

// Ensure connection before making requests
export const ensureOrbisConnection = async () => {
  const res = await orbis.isConnected();
  if (!res || !res.status) {
    return initializeOrbis();
  }
  return true;
};

export interface OrbisPost {
    stream_id: string;
    content: {
        body: string;
    };
    creator: string;
    creator_details: {
        did: string;
        profile?: {
            username: string;
            pfp: string;
            verified?: boolean;
        };
    };
    timestamp: number;
    count_likes: number;
    count_replies: number;
    count_haha: number;
}

export async function connectOrbis() {
    const res = await orbis.connect_v2({
        provider: window.ethereum,
        lit: false,
    });
    return res.status === 200;
}

export async function createPost(content: string, hashtags: string[] = [], ipfsHash?: string) {
    // Basic sanitization for iframes
    const sanitizedContent = content.replace(
        /<iframe[^>]*(src="https:\/\/[^"]*")[^>]*>[^<]*<\/iframe>/gi,
        (match, src) => {
            // Only allow iframes with https sources
            if (src.startsWith('src="https://')) {
                return match;
            }
            return '';
        }
    );

    // Create post data
    const postData: any = {
        body: sanitizedContent,
        context: 'youbuidl:post',
        tags: hashtags
    };

    // Add data field with IPFS hash if provided
    if (ipfsHash) {
        postData.data = { ipfsHash };
    }

    // Ensure we're connected to Orbis
    await ensureOrbisConnection();

    // Create the post
    const res = await orbis.createPost(postData);

    return res;
}

export async function getPosts() {
    try {
        const { data, error } = await orbis.getPosts({
            context: 'youbuidl:post'
        });

        if (error) {
            throw error;
        }

        console.log('Raw Orbis posts:', data); // Debug log

        return data;
    } catch (error) {
        console.error('Error in getPosts:', error);
        throw error;
    }
}

export async function likePost(postId: string) {
    const { status: isConnected } = await orbis.isConnected();

    if (!isConnected && typeof window !== 'undefined' && window.ethereum) {
        const result = await orbis.connect_v2({
            provider: window.ethereum,
            chain: 'ethereum'
        });

        if (!result.status) {
            throw new Error('Failed to connect to Orbis');
        }
    }

    return await orbis.react(postId, 'like');
}

export async function commentOnPost(postId: string, content: string) {
    return await orbis.createPost({
        context: 'youbuidl:comment',
        body: content,
        master: postId, // This links the comment to the original post
    });
}







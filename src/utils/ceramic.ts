import { Orbis } from "@orbisclub/orbis-sdk";

const orbis = new Orbis({
  useLit: false,
  node: "https://node2.orbis.club",
  PINATA_GATEWAY: 'https://gateway.pinata.cloud/ipfs/',
  CERAMIC_NODE: "https://node2.orbis.club"
});

export async function fetchPostFromCeramic(streamId: string) {
  try {
    const { data, error } = await orbis.getPost(streamId);
    
    if (error) throw new Error(error.message);
    if (!data) throw new Error('Post not found');
    
    return {
      title: data.content?.title || '',
      body: data.content?.body || '',
      timestamp: data.timestamp,
      creator: data.creator_details?.profile?.username || data.creator
    };
  } catch (error) {
    console.error('Error fetching post from Ceramic:', error);
    throw error;
  }
}
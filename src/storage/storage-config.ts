import gcsecrets from 'gcsecrets.json'

const StorageConfig = {
  projectId: gcsecrets.project_id,
  private_key: gcsecrets.private_key,
  client_email: gcsecrets.client_email,
  mediaBucket: process.env.STORAGE_MEDIA_BUCKET
}

export default StorageConfig

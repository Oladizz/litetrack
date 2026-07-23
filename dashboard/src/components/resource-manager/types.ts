export type ResourceCategory = 
  | 'Users' 
  | 'Products' 
  | 'Media' 
  | 'AI' 
  | 'Reports' 
  | 'Templates' 
  | 'Plugins' 
  | 'APIs' 
  | 'Custom';

export type StorageProvider = 'Local' | 'AWS S3' | 'Cloudflare R2' | 'Google Cloud' | 'Azure' | 'Dropbox';

export interface ResourceVersion {
  version: string;
  createdAt: string;
  createdBy: string;
  summary: string;
}

export interface ResourceRelationship {
  targetId: string;
  targetTitle: string;
  targetCategory: string;
  relationType: 'owns' | 'purchased' | 'generated' | 'attached_to' | 'created_by';
}

export interface ResourceItem {
  id: string;
  title: string;
  description?: string;
  category: ResourceCategory;
  type: 'document' | 'image' | 'video' | 'audio' | 'db_record' | 'ai_asset' | 'dev_secret';
  owner: string;
  status: 'published' | 'draft' | 'archived' | 'pinned';
  version: string;
  storageProvider: StorageProvider;
  sizeBytes?: number;
  thumbnailUrl?: string;
  tags: string[];
  metadata: Record<string, any>;
  relationships: ResourceRelationship[];
  versionHistory: ResourceVersion[];
  createdAt: string;
  updatedAt: string;
}

export interface SmartCollection {
  id: string;
  title: string;
  query: string;
  itemCount: number;
  category: string;
}

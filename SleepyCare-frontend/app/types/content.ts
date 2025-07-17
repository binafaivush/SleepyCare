export interface ContentItem {
    id: string;
    title: string;
    description: string;
    type: 'Article' | 'Video'; 
    url: URL;
    uploaded_by: string;
    thumbnail?: string; 
  }
  
  export interface ExternalLinkItem {
    id: string;
    title: string;
    url: string;
    iconName?: string;
  }
export interface Reminder {
  id: string;
  title: string;
  time: Date; 
  description?: string;
  zoomLink?: string; 
  clientName?: string;
}

  export type ContentItemUnion = ContentItem | ExternalLinkItem | Reminder;
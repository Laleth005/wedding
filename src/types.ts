export interface WeddingEvent {
  id: string;
  name: string;
  subTitle: string;
  date: string;
  time: string;
  venue: string;
  dressCode: string;
  iconName: 'ring' | 'sparkles' | 'heart' | 'glass' | 'flower' | 'music';
  description: string;
  entranceDirection: 'left' | 'right' | 'bottom' | 'zoom';
}

export interface TimelineItem {
  id: string;
  time: string;
  title: string;
  description: string;
  icon: string;
}

export interface GalleryPhoto {
  id: string;
  src: string;
  fallbackSrc?: string;
  caption: string;
  category: string;
  widthSpan?: string;
  heightSpan?: string;
}

export interface BlessingWish {
  id: string;
  guestName: string;
  relation: string;
  message: string;
  date: string;
}

export interface RSVPFormData {
  fullName: string;
  phone: string;
  email: string;
  attending: 'yes' | 'no';
  guestCount: number;
  dietPreference: 'vegetarian' | 'non-veg' | 'jain';
  eventsAttending: string[];
  personalMessage: string;
}

/**
 * PROJECT ADMIN REGISTRY
 * 
 * This is the single source of truth for all project admin panels.
 * To add a new project, simply add a new entry to `PROJECT_REGISTRY`.
 * 
 * Each project defines:
 * - slug: URL path segment (e.g., "oladizz-xyz" → /admin/oladizz-xyz)
 * - name: Display name
 * - firebase: Connection details (projectId, databaseId, etc.)
 * - sections: Array of admin sections, each with a collection name, 
 *   display columns, and which fields are editable
 */

export interface ColumnDef {
  key: string;
  label: string;
  type: 'text' | 'number' | 'badge' | 'date' | 'image' | 'list' | 'boolean' | 'json';
  truncate?: number;
  badgeColors?: Record<string, string>;
}

export interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'boolean' | 'image' | 'list' | 'json' | 'date';
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

export interface AdminSection {
  id: string;
  label: string;
  icon: string;         // emoji
  collection: string;   // Firestore collection name
  isAuthUsers?: boolean; // If true, fetches from Firebase Auth instead of Firestore
  columns?: ColumnDef[];
  fields?: FieldDef[];
  defaultSort?: string;
}

export interface ProjectConfig {
  slug: string;
  name: string;
  domain: string;
  icon: string;
  color: string;
  theme?: 'cyberpunk' | 'ecommerce' | 'default';
  firebase: {
    projectId: string;
    databaseId?: string; // defaults to "(default)"
  };
  sections: AdminSection[];
}

// ═══════════════════════════════════════════════════════════════
// PROJECT 1: OLADIZZ.XYZ (Portfolio)
// Firebase: my-portfolio-7cd72, database: (default)
// ═══════════════════════════════════════════════════════════════
const OLADIZZ_XYZ: ProjectConfig = {
  slug: 'oladizz-xyz',
  name: 'Oladizz.xyz',
  domain: 'oladizz.xyz',
  icon: '🌐',
  color: '#00B2FF', // cyan
  theme: 'cyberpunk',
  firebase: {
    projectId: 'my-portfolio-7cd72',
  },
  sections: [
    { id: 'overview', label: 'Overview', icon: '📊', collection: 'content' },
    { id: 'ordering', label: 'Arrange Sections', icon: '📋', collection: 'content' },
    { id: 'hero', label: 'Hero Section', icon: '👤', collection: 'content' },
    { id: 'about', label: 'About Section', icon: '📝', collection: 'content' },
    { id: 'experience', label: 'Experience', icon: '💼', collection: 'content' },
    { id: 'skills', label: 'Skills', icon: '🛠️', collection: 'content' },
    { id: 'projects', label: 'Projects', icon: '📂', collection: 'content' },
    { id: 'contact', label: 'Contact', icon: '📧', collection: 'content' },
    { id: 'techDNA', label: 'Tech DNA', icon: '🧬', collection: 'content' },
    { id: 'impactTimeline', label: 'Timeline', icon: '📅', collection: 'content' },
    { id: 'terminal', label: 'Terminal', icon: '💻', collection: 'content' },
    { id: 'liveDashboard', label: 'Dashboard', icon: '📈', collection: 'content' },
    { 
      id: 'messages', label: 'Messages', icon: '✉️', collection: 'contactMessages',
      columns: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'email', label: 'Email', type: 'text' },
        { key: 'subject', label: 'Subject', type: 'text' },
        { key: 'timestamp', label: 'Time', type: 'date' }
      ],
      fields: []
    },
    { 
      id: 'comments', label: 'Comments', icon: '💬', collection: 'projectComments',
      columns: [
        { key: 'authorName', label: 'Name', type: 'text' },
        { key: 'projectId', label: 'Project', type: 'badge' },
        { key: 'text', label: 'Comment', type: 'text' }
      ],
      fields: []
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// PROJECT 2: OLADIZZ STORE (E-Commerce)
// Firebase: my-portfolio-7cd72, database: "store"
// ═══════════════════════════════════════════════════════════════
const OLADIZZ_STORE: ProjectConfig = {
  slug: 'oladizz-store',
  name: 'Oladizz Store',
  domain: 'oladizzstore.com',
  icon: '🛒',
  color: '#fbbf24', // amber/gold
  theme: 'ecommerce',
  firebase: {
    projectId: 'my-portfolio-7cd72',
    databaseId: 'store',
  },
  sections: [
    {
      id: 'products',
      label: 'Products',
      icon: '📦',
      collection: 'products',
      columns: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'price', label: 'Price', type: 'number' },
        { key: 'stock', label: 'Stock', type: 'number' },
        { key: 'category', label: 'Category', type: 'badge' },
        { key: 'status', label: 'Status', type: 'badge', badgeColors: { 'Active': '#10b981', 'Draft': '#f59e0b', 'Archived': '#ef4444' } },
        { key: 'rating', label: 'Rating', type: 'number' },
      ],
      fields: [
        { key: 'name', label: 'Product Name', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea', required: true },
        { key: 'price', label: 'Price ($)', type: 'number', required: true },
        { key: 'stock', label: 'Stock', type: 'number', required: true },
        { key: 'category', label: 'Category', type: 'text', required: true },
        { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Draft', 'Scheduled', 'Archived'] },
        { key: 'brand', label: 'Brand', type: 'text' },
        { key: 'sku', label: 'SKU', type: 'text' },
        { key: 'image', label: 'Image URL', type: 'text' },
        { key: 'features', label: 'Features', type: 'list' },
        { key: 'supplierPrice', label: 'Supplier Price', type: 'number' },
        { key: 'weight', label: 'Weight', type: 'text' },
        { key: 'deliveryTime', label: 'Delivery Time', type: 'text' },
      ],
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: '🧾',
      collection: 'orders',
      columns: [
        { key: 'id', label: 'Order ID', type: 'text', truncate: 12 },
        { key: 'customerName', label: 'Customer', type: 'text' },
        { key: 'customerEmail', label: 'Email', type: 'text' },
        { key: 'total', label: 'Total ($)', type: 'number' },
        { key: 'status', label: 'Status', type: 'badge', badgeColors: { 'Processing': '#f59e0b', 'Shipped': '#3b82f6', 'Delivered': '#10b981', 'Cancelled': '#ef4444' } },
        { key: 'date', label: 'Date', type: 'date' },
      ],
      fields: [
        { key: 'customerName', label: 'Customer Name', type: 'text' },
        { key: 'customerEmail', label: 'Customer Email', type: 'text' },
        { key: 'status', label: 'Status', type: 'select', options: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], required: true },
        { key: 'total', label: 'Total ($)', type: 'number' },
        { key: 'trackingNumber', label: 'Tracking Number', type: 'text' },
        { key: 'shippingCarrier', label: 'Carrier', type: 'select', options: ['FedEx', 'DHL', 'USPS', 'UPS', 'Other'] },
        { key: 'items', label: 'Items (JSON)', type: 'json' },
      ],
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: '👥',
      collection: 'users',
      columns: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'email', label: 'Email', type: 'text' },
        { key: 'role', label: 'Role', type: 'badge', badgeColors: { 'admin': '#ef4444', 'customer': '#3b82f6', 'user': '#a6a6a6' } },
        { key: 'country', label: 'Country', type: 'text' },
        { key: 'phone', label: 'Phone', type: 'text' },
      ],
      fields: [
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'email', label: 'Email', type: 'text', required: true },
        { key: 'role', label: 'Role', type: 'select', options: ['customer', 'admin', 'user'] },
        { key: 'phone', label: 'Phone', type: 'text' },
        { key: 'country', label: 'Country', type: 'text' },
        { key: 'state', label: 'State', type: 'text' },
        { key: 'location', label: 'Location', type: 'text' },
      ],
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: '🏷️',
      collection: 'categories',
      columns: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'image', label: 'Image', type: 'image' },
      ],
      fields: [
        { key: 'name', label: 'Category Name', type: 'text', required: true },
        { key: 'image', label: 'Image URL', type: 'text' },
      ],
    },
    {
      id: 'coupons',
      label: 'Coupons',
      icon: '🎟️',
      collection: 'coupons',
      columns: [
        { key: 'code', label: 'Code', type: 'text' },
        { key: 'discountType', label: 'Type', type: 'badge', badgeColors: { 'percentage': '#8b5cf6', 'fixed': '#10b981' } },
        { key: 'discountValue', label: 'Value', type: 'number' },
        { key: 'isActive', label: 'Active', type: 'boolean' },
        { key: 'minPurchase', label: 'Min Purchase', type: 'number' },
      ],
      fields: [
        { key: 'code', label: 'Coupon Code', type: 'text', required: true, placeholder: 'e.g. SUMMER20' },
        { key: 'discountType', label: 'Discount Type', type: 'select', options: ['percentage', 'fixed'], required: true },
        { key: 'discountValue', label: 'Discount Value', type: 'number', required: true },
        { key: 'isActive', label: 'Active', type: 'boolean' },
        { key: 'minPurchase', label: 'Minimum Purchase ($)', type: 'number' },
      ],
    },
    {
      id: 'auctions',
      label: 'Auctions',
      icon: '🔨',
      collection: 'auctions',
      columns: [
        { key: 'name', label: 'Item', type: 'text' },
        { key: 'currentBid', label: 'Current Bid', type: 'number' },
        { key: 'minBid', label: 'Min Bid', type: 'number' },
        { key: 'bids', label: 'Bids', type: 'number' },
        { key: 'seller', label: 'Seller', type: 'text' },
        { key: 'endsAt', label: 'Ends At', type: 'date' },
      ],
      fields: [
        { key: 'name', label: 'Item Name', type: 'text', required: true },
        { key: 'image', label: 'Image URL', type: 'text' },
        { key: 'currentBid', label: 'Current Bid ($)', type: 'number' },
        { key: 'minBid', label: 'Minimum Bid ($)', type: 'number', required: true },
        { key: 'category', label: 'Category', type: 'text' },
        { key: 'seller', label: 'Seller', type: 'text' },
        { key: 'endsAt', label: 'Ends At', type: 'date' },
      ],
    },
    {
      id: 'settings',
      label: 'Store Settings',
      icon: '⚙️',
      collection: 'settings',
      columns: [
        { key: 'id', label: 'Setting', type: 'text' },
      ],
      fields: [
        { key: 'storeName', label: 'Store Name', type: 'text' },
        { key: 'supportEmail', label: 'Support Email', type: 'text' },
        { key: 'currency', label: 'Currency', type: 'text' },
        { key: 'shippingFee', label: 'Shipping Fee ($)', type: 'number' },
        { key: 'freeShippingThreshold', label: 'Free Shipping Threshold ($)', type: 'number' },
        { key: 'announcementBar', label: 'Announcement Banner', type: 'text' },
      ],
    },
    {
      id: 'product-requests',
      label: 'Product Requests',
      icon: '🗳️',
      collection: 'productRequests',
      columns: [
        { key: 'name', label: 'Product', type: 'text' },
        { key: 'votes', label: 'Votes', type: 'number' },
        { key: 'requesterName', label: 'Requested By', type: 'text' },
        { key: 'status', label: 'Status', type: 'badge', badgeColors: { 'pending': '#f59e0b', 'reviewed': '#3b82f6', 'listed': '#10b981' } },
      ],
      fields: [
        { key: 'name', label: 'Product Name', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'status', label: 'Status', type: 'select', options: ['pending', 'reviewed', 'listed'] },
        { key: 'votes', label: 'Votes', type: 'number' },
        { key: 'requesterName', label: 'Requester Name', type: 'text' },
      ],
    },
  ],
};


// ═══════════════════════════════════════════════════════════════
// MASTER REGISTRY
// ═══════════════════════════════════════════════════════════════
export const PROJECT_REGISTRY: ProjectConfig[] = [
  OLADIZZ_XYZ,
  OLADIZZ_STORE,
];

export function getProjectBySlug(slug: string): ProjectConfig | undefined {
  return PROJECT_REGISTRY.find(p => p.slug === slug);
}

import { ColumnDef } from '@/components/data-manager/types';

export interface SchemaRegistry {
  [key: string]: {
    title: string;
    description: string;
    columns: ColumnDef[];
    collectionName: string;
  };
}

export const OladizzSchemas: SchemaRegistry = {
  products: {
    title: 'Products Inventory',
    description: 'Manage all store products, prices, and stock.',
    collectionName: 'products',
    columns: [
      { id: 'id', label: 'ID', type: 'link', sortable: true },
      { id: 'name', label: 'Product Name', type: 'text', sortable: true },
      { id: 'price', label: 'Price', type: 'currency', sortable: true, formatOptions: { currencySymbol: '$' } },
      { id: 'category', label: 'Category', type: 'badge', sortable: true },
      { id: 'stock', label: 'Stock', type: 'number', sortable: true },
      { id: 'rating', label: 'Rating', type: 'rating', sortable: true, formatOptions: { maxRating: 5 } },
    ]
  },
  categories: {
    title: 'Product Categories',
    description: 'Organize your store taxonomy.',
    collectionName: 'categories',
    columns: [
      { id: 'id', label: 'ID', type: 'link', sortable: true },
      { id: 'name', label: 'Category Name', type: 'text', sortable: true },
      { id: 'slug', label: 'Slug', type: 'text', sortable: true },
      { id: 'productCount', label: 'Products', type: 'number', sortable: true },
      { id: 'status', label: 'Status', type: 'status', sortable: true },
    ]
  },
  orders: {
    title: 'Store Orders',
    description: 'Track and fulfill customer orders.',
    collectionName: 'orders',
    columns: [
      { id: 'id', label: 'Order ID', type: 'link', sortable: true },
      { id: 'customerName', label: 'Customer', type: 'text', sortable: true },
      { id: 'total', label: 'Total', type: 'currency', sortable: true, formatOptions: { currencySymbol: '$' } },
      { id: 'status', label: 'Order Status', type: 'status', sortable: true },
      { id: 'paymentStatus', label: 'Payment', type: 'badge', sortable: true },
      { id: 'date', label: 'Date', type: 'date', sortable: true },
    ]
  },
  customers: {
    title: 'Customers',
    description: 'Manage customer accounts and lifetimes.',
    collectionName: 'customers',
    columns: [
      { id: 'id', label: 'ID', type: 'link', sortable: true },
      { id: 'name', label: 'Name', type: 'avatar', sortable: true },
      { id: 'email', label: 'Email', type: 'text', sortable: true },
      { id: 'totalSpent', label: 'Total Spent', type: 'currency', sortable: true, formatOptions: { currencySymbol: '$' } },
      { id: 'ordersCount', label: 'Orders', type: 'number', sortable: true },
      { id: 'status', label: 'Status', type: 'status', sortable: true },
    ]
  },
  coupons: {
    title: 'Discount Coupons',
    description: 'Create and manage promotional codes.',
    collectionName: 'coupons',
    columns: [
      { id: 'id', label: 'ID', type: 'link', sortable: true },
      { id: 'code', label: 'Promo Code', type: 'badge', sortable: true },
      { id: 'discount', label: 'Discount Amount', type: 'text', sortable: true },
      { id: 'usageCount', label: 'Used', type: 'number', sortable: true },
      { id: 'status', label: 'Status', type: 'status', sortable: true },
      { id: 'expiry', label: 'Expiry Date', type: 'date', sortable: true },
    ]
  },
  ads: {
    title: 'Advertising Campaigns',
    description: 'Manage marketing campaigns across platforms.',
    collectionName: 'ads',
    columns: [
      { id: 'id', label: 'ID', type: 'link', sortable: true },
      { id: 'campaignName', label: 'Campaign', type: 'text', sortable: true },
      { id: 'platform', label: 'Platform', type: 'badge', sortable: true },
      { id: 'spend', label: 'Spend', type: 'currency', sortable: true, formatOptions: { currencySymbol: '$' } },
      { id: 'roas', label: 'ROAS', type: 'percentage', sortable: true },
      { id: 'status', label: 'Status', type: 'status', sortable: true },
    ]
  },
  dropshipping: {
    title: 'Dropshipping Suppliers',
    description: 'Manage supplier connections and syncing.',
    collectionName: 'suppliers',
    columns: [
      { id: 'id', label: 'Supplier ID', type: 'link', sortable: true },
      { id: 'name', label: 'Supplier Name', type: 'avatar', sortable: true },
      { id: 'country', label: 'Country', type: 'badge', sortable: true },
      { id: 'syncStatus', label: 'Sync Status', type: 'status', sortable: true },
      { id: 'activeProducts', label: 'Active Products', type: 'number', sortable: true },
      { id: 'lastSync', label: 'Last Sync', type: 'date', sortable: true },
    ]
  }
};

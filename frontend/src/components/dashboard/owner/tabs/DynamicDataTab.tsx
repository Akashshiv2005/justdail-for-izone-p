import React, { useState } from 'react';
import MyBusinessTab from './MyBusinessTab';
import GalleryTab from './GalleryTab';
import AnalyticsTab from './AnalyticsTab';
import SettingsTab from './SettingsTab';
import SupportTab from './SupportTab';
import DefaultTableTab from './DefaultTableTab';
import ReviewBizDialTab from './ReviewBizDialTab';
import { authFetch } from '../../../../lib/services/authFetch';

interface OwnerProfile {
  business_id: number;
  owner_id: number;
  owner_name: string;
  owner_email: string;
  owner_phone: string;
  business_name: string;
  category: string;
  primary_category_id: number | null;
  subcategory: string;
  primary_subcategory_id: number | null;
  address: string;
  city: string;
  pincode: string;
  phone: string;
  whatsapp: string;
  website: string;
  is_verified: boolean;
  average_rating: number;
  total_reviews: number;
  latitude?: number;
  longitude?: number;
}

export default function DynamicDataTab({ tabName, businessId, profile }: { tabName: string; businessId: number; profile: OwnerProfile | null }) {
  const [editingRow, setEditingRow] = useState<any>(null);

  const getColumns = (tab: string) => {
    switch (tab) {
      case 'My Business': return ['Detail', 'Value', 'Status', 'Last Updated'];
      case 'Products': return ['Product Name', 'Category'];
      case 'Services': return ['Service Name'];
      case 'Gallery': return ['Image Title', 'Category', 'Views', 'Uploaded', 'Status'];
      case 'Leads': return ['Customer Name', 'Contact Info', 'Service Interest', 'Date', 'Status'];
      case 'Reviews': return ['Customer', 'Rating', 'Review Snippet', 'Date', 'Status'];
      case 'Analytics': return ['Metric', 'Current Period', 'Previous Period', 'Change', 'Status'];
      case 'Promotions': return ['Campaign Name', 'Type', 'Budget', 'Clicks', 'Status'];
      case 'Manage Staff': return ['Staff Name', 'Role', 'Email', 'Phone', 'Status'];
      case 'Invoices': return ['Invoice #', 'Date', 'Amount', 'Description', 'Status'];
      case 'Settings': return ['Setting Name', 'Description', 'Current Value', 'Module', 'Status'];
      case 'Support': return ['Ticket ID', 'Subject', 'Category', 'Last Updated', 'Status'];
      default: return ['ID', 'Name', 'Description', 'Date', 'Status'];
    }
  };

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshCount, setRefreshCount] = useState(0);

  const refreshData = () => setRefreshCount(prev => prev + 1);

  React.useEffect(() => {
    setLoading(true);
    const endpoint = tabName.toLowerCase().replace(' ', '');
    authFetch(`/api/owner/${businessId}/${endpoint}`)
      .then(res => {
        if (!res.ok) throw new Error('API not implemented yet for this tab');
        return res.json();
      })
      .then(apiData => {
        // Map API data to the col1, col2 format expected by the UI
        const mappedData = apiData.map((item: any, i: number) => {
          const obj: any = { id: item.id, status: item.status || 'Active' };
          switch (tabName) {
            case 'Products':
              obj.col1 = item.name;
              obj.col2 = item.category;
              obj.col3 = `₹${item.price}`;
              obj.col4 = `${item.stock_quantity} units`;
              break;
            case 'Services':
              obj.col1 = item.name; // master service name
              obj.col2 = item.duration; // custom description
              obj.col3 = `₹${item.base_price}`; // custom price
              obj.col4 = item.popularity_score;
              obj.master_service_id = item.master_service_id;
              break;
            case 'Leads':
              obj.col1 = item.customer_name;
              obj.col2 = item.customer_phone;
              obj.col3 = item.service_interest;
              obj.col4 = item.created_at;
              break;
            case 'Gallery':
              obj.col1 = item.title;
              obj.col2 = item.category;
              obj.col3 = `${item.views_count} Views`;
              obj.col4 = item.image_url;
              break;
            case 'Reviews':
              obj.col1 = item.customer_name;
              obj.col2 = String(item.rating);
              obj.col3 = item.comment;
              obj.col4 = item.created_at ? item.created_at.split('T')[0] : '';
              obj.status = item.status || 'Active';
              break;
            case 'Manage Staff':
              obj.col1 = item.name;
              obj.col2 = item.role;
              obj.col3 = item.email;
              obj.col4 = item.phone;
              break;
            default:
              obj.col1 = `Item ${i + 1}`;
              obj.col2 = 'Data';
              obj.col3 = 'Value';
              obj.col4 = 'Date';
          }
          return obj;
        });
        setData(mappedData);
      })
      .catch(err => {
        console.error(err);
        setData([]); // Fallback to empty if API fails
      })
      .finally(() => setLoading(false));
  }, [tabName, refreshCount]);

  const columns = getColumns(tabName);

  if (tabName === 'My Business') {
    return <MyBusinessTab profile={profile} businessId={businessId} refreshData={refreshData} />;
  }

  if (tabName === 'Gallery') {
    return <GalleryTab data={data} setEditingRow={setEditingRow} businessId={businessId} refreshData={refreshData} />;
  }

  if (tabName === 'Analytics') {
    return <AnalyticsTab />;
  }

  if (tabName === 'Settings') {
    return <SettingsTab profile={profile} />;
  }

  if (tabName === 'Support') {
    return <SupportTab />;
  }

  if (tabName === 'Rate BizDial') {
    return <ReviewBizDialTab businessId={businessId} profile={profile} />;
  }

  return <DefaultTableTab tabName={tabName} data={data} columns={columns} editingRow={editingRow} setEditingRow={setEditingRow} refreshData={refreshData} businessId={businessId} />;
}

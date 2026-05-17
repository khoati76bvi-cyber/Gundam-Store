
import AdminCrud from '@/components/admin/AdminCrud';
export default function Page() {
  return <AdminCrud title="Customers" endpoint="/api/admin/customers" fields=[{"key": "name", "label": "Name", "type": "text"}, {"key": "email", "label": "Email", "type": "text"}, {"key": "phone", "label": "Phone", "type": "text"}, {"key": "address", "label": "Address", "type": "textarea"}, {"key": "tier", "label": "Tier", "type": "select", "options": ["Member", "Silver", "Gold", "VIP"]}] columns=["id", "name", "email", "phone", "tier"] initial={"tier": "Member"} />
}

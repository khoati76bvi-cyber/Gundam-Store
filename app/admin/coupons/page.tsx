
import AdminCrud from '@/components/admin/AdminCrud';
export default function Page() {
  return <AdminCrud title="Coupons" endpoint="/api/admin/coupons" fields=[{"key": "code", "label": "Code", "type": "text"}, {"key": "type", "label": "Type", "type": "select", "options": ["PERCENT", "FIXED"]}, {"key": "value", "label": "Value", "type": "number"}, {"key": "active", "label": "Active", "type": "checkbox"}] columns=["id", "code", "type", "value", "active"] initial={"type": "PERCENT", "active": true} />
}

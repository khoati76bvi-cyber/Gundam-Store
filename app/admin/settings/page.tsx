
import AdminCrud from '@/components/admin/AdminCrud';
export default function Page() {
  return <AdminCrud title="Settings" endpoint="/api/admin/settings" fields=[{"key": "key", "label": "Key", "type": "text"}, {"key": "value", "label": "Value", "type": "textarea"}] columns=["id", "key", "value"] initial={} />
}

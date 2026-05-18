import AdminCrud from '@/components/admin/AdminCrud';
export const dynamic = 'force-dynamic';
export default function Page() {
  return (
    <AdminCrud
      title="Settings"
      endpoint="/api/admin/settings"
      fields={[{ "key": "key", "label": "Key", "type": "text" }, { "key": "value", "label": "Value", "type": "textarea" }]}
      columns={["id", "key", "value"]}
      initial={{}}
    />
  );
}
import CreateProductForm from "@/components/admin/CreateProductForm";

export default function CreateProductPage() {
  return (
    <div>
      <p className="text-sm uppercase tracking-[0.3em] text-red-400">
        Product Management
      </p>

      <h1 className="mt-2 text-4xl font-black">Thêm sản phẩm mới</h1>

      <div className="mt-8">
        <CreateProductForm />
      </div>
    </div>
  );
}

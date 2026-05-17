
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.analyticsEvent.deleteMany(); await prisma.searchInsight.deleteMany(); await prisma.inventoryLog.deleteMany(); await prisma.orderItem.deleteMany(); await prisma.order.deleteMany(); await prisma.customer.deleteMany(); await prisma.product.deleteMany(); await prisma.banner.deleteMany(); await prisma.coupon.deleteMany(); await prisma.setting.deleteMany(); await prisma.mediaAsset.deleteMany(); await prisma.contentPage.deleteMany();
  const products = [
    ['mgex-strike-freedom','MGEX Strike Freedom Gundam','MG','Master Grade',3290000,3690000,12,'/products/freedom.svg','HOT',true],
    ['rg-hi-nu-gundam','RG Hi-ν Gundam','RG','Real Grade',1250000,1450000,18,'/products/hinu.svg','BEST',true],
    ['hg-aerial-rebuild','HG Aerial Rebuild','HG','High Grade',520000,650000,31,'/products/aerial.svg','SALE',true],
    ['mg-aile-strike-ver-rm','MG Aile Strike Ver.RM','MG','Master Grade',1180000,1350000,10,'/products/strike.svg','NEW',false],
    ['entry-grade-rx-78-2','Entry Grade RX-78-2','EG','Entry Grade',220000,260000,40,'/products/rx78.svg','BEGINNER',false],
    ['rg-sazabi','RG Sazabi','RG','Real Grade',1480000,1650000,8,'/products/sazabi.svg','LIMITED',true],
    ['mg-barbatos','MG Gundam Barbatos','MG','Master Grade',1050000,1190000,15,'/products/barbatos.svg','HOT',false],
    ['godhand-style-nipper','Premium Build Nipper','Tools','Accessory',280000,330000,55,'/products/nipper.svg','TOOL',false]
  ];
  for (const p of products) await prisma.product.create({data:{slug:p[0] as string,name:p[1] as string,category:p[2] as string,grade:p[3] as string,price:p[4] as number,compareAt:p[5] as number,stock:p[6] as number,image:p[7] as string,badge:p[8] as string,featured:p[9] as boolean,description:'Mô hình chính hãng, chi tiết sắc nét, phù hợp trưng bày và sưu tầm. Đóng gói an toàn, hỗ trợ đổi trả theo chính sách shop.', specs: JSON.stringify({scale:'1/144 - 1/100',brand:'Bandai',origin:'Japan',condition:'New sealed'})}});
  await prisma.banner.createMany({data:[
    {title:'GUNDAMSTORE MEGA SALE',subtitle:'Mô hình chính hãng, ưu đãi đến 35%',image:'/banners/hero1.svg',desktopMedia:'/banners/hero1.svg',mobileMedia:'/banners/hero1.svg',mediaType:'image',buttonText:'Mua ngay',linkUrl:'/category/MG',ctaText:'Mua ngay',ctaHref:'/category/MG',position:'HOME_HERO',autoplayMs:4200,sortOrder:1},
    {title:'PRE-ORDER LIMITED KIT',subtitle:'Đặt trước hàng hiếm, giữ slot sớm',image:'/banners/hero2.svg',desktopMedia:'/banners/hero2.svg',mobileMedia:'/banners/hero2.svg',mediaType:'image',buttonText:'Pre-order',linkUrl:'/category/RG',ctaText:'Pre-order',ctaHref:'/category/RG',position:'HOME_HERO',autoplayMs:4500,sortOrder:2},
    {title:'BUILD TOOLS WEEK',subtitle:'Combo dụng cụ build kit cho beginner',image:'/banners/hero3.svg',desktopMedia:'/banners/hero3.svg',mobileMedia:'/banners/hero3.svg',mediaType:'image',buttonText:'Xem combo',linkUrl:'/category/Tools',ctaText:'Xem combo',ctaHref:'/category/Tools',position:'HOME_HERO',autoplayMs:4800,sortOrder:3}
  ]});
  const customer = await prisma.customer.create({data:{name:'Nguyễn Tuấn Anh',email:'tuananh@example.com',phone:'0909000000',address:'TP.HCM',tier:'Gold'}});
  const prod = await prisma.product.findFirstOrThrow();
  await prisma.order.create({data:{code:'GDS-10001',customerId:customer.id,customerName:customer.name,customerEmail:customer.email,phone:'0909000000',address:'TP.HCM',status:'CONFIRMED',paymentMethod:'COD',paymentStatus:'PENDING',subtotal:prod.price,shippingFee:30000,total:prod.price+30000,items:{create:[{productId:prod.id,name:prod.name,price:prod.price,quantity:1}]}}});
  await prisma.coupon.createMany({data:[{code:'GUNDAM10',type:'PERCENT',value:10},{code:'FREESHIP',type:'FIXED',value:30000}]});
  await prisma.setting.createMany({data:[{key:'storeName',value:'GundamStore Vietnam'},{key:'hotline',value:'0909 000 000'},{key:'shippingFee',value:'30000'},
    {key:'theme.preset',value:'GUNDAM_DARK'},{key:'theme.primary',value:'#ef233c'},{key:'theme.accent',value:'#22d3ee'},{key:'theme.bg',value:'#05070d'},{key:'theme.panel',value:'rgba(255,255,255,.055)'},
    {key:'layout.productCard',value:'premium'},{key:'layout.bannerStyle',value:'cinematic'},
    {key:'section.hero',value:'true'},{key:'section.usp',value:'true'},{key:'section.featuredProducts',value:'true'},{key:'section.advancedFilter',value:'true'},{key:'section.collections',value:'true'},{key:'section.community',value:'true'},{key:'section.news',value:'true'}]});
  await prisma.mediaAsset.createMany({data:[{url:'/products/freedom.svg',filename:'freedom.svg',mimeType:'image/svg+xml',size:1200,alt:'MGEX Strike Freedom',folder:'products'},{url:'/banners/hero1.svg',filename:'hero1.svg',mimeType:'image/svg+xml',size:1200,alt:'Hero banner',folder:'banners'}]});
  await prisma.contentPage.createMany({data:[{slug:'beginner-build-guide',title:'Beginner Build Guide',type:'GUIDE',excerpt:'Hướng dẫn build kit cho người mới.',coverImage:'/banners/combo.svg',body:'Chuẩn bị nipper, panel liner, sanding stick và action base. Build theo manual, xử lý nub mark nhẹ và chụp ảnh showcase.',status:'PUBLISHED',seoTitle:'Gundam build guide cho beginner',seoDesc:'Hướng dẫn build Gundam cơ bản.'},{slug:'preorder-policy',title:'Pre-order Policy',type:'PAGE',excerpt:'Quy trình đặt trước hàng limited.',coverImage:'/banners/hero2.svg',body:'Khách đặt cọc, shop xác nhận slot, cập nhật ETA và thông báo khi hàng về.',status:'PUBLISHED'}]});
  await prisma.inventoryLog.create({data:{productId:prod.id,productName:prod.name,type:'IN',quantity:12,note:'Initial seed stock'}});

  await prisma.searchInsight.createMany({data:[
    {keyword:'mg freedom',resultCount:2},{keyword:'rg sazabi',resultCount:1},{keyword:'panel liner',resultCount:1},{keyword:'metal build',resultCount:0},{keyword:'ver ka',resultCount:2}
  ]});
  await prisma.analyticsEvent.createMany({data:[
    {sessionId:'demo-1',type:'PAGE_VIEW',path:'/'},{sessionId:'demo-1',type:'PRODUCT_VIEW',path:'/product/mgex-strike-freedom',productSlug:'mgex-strike-freedom',productName:'MGEX Strike Freedom Gundam',value:3290000},{sessionId:'demo-1',type:'ADD_TO_CART',productSlug:'mgex-strike-freedom',productName:'MGEX Strike Freedom Gundam',value:3290000},
    {sessionId:'demo-2',type:'PAGE_VIEW',path:'/search'},{sessionId:'demo-2',type:'SEARCH',keyword:'rg sazabi',value:1},{sessionId:'demo-2',type:'PRODUCT_VIEW',productSlug:'rg-sazabi',productName:'RG Sazabi',value:1480000},
    {sessionId:'demo-3',type:'PAGE_VIEW',path:'/'},{sessionId:'demo-3',type:'BANNER_CLICK',bannerId:1,path:'/'},{sessionId:'demo-3',type:'PRODUCT_VIEW',productSlug:'rg-hi-nu-gundam',productName:'RG Hi-ν Gundam',value:1250000}
  ]});

}
main().finally(()=>prisma.$disconnect());

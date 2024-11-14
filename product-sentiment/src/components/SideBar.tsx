import { Product } from '../pages/home'
import { ProductModal } from './Modal'

export const SideBar = ({ products }: { products: Product[] }) => {
    return (
        <div className='bg-tertiary text-offWhite min-h-screen px-10 lg:px-7 pb-7'>
            <div className='flex justify-between items-center pb-5 sticky top-0 z-40 bg-tertiary pt-5'>
                <p className='font-[500] lg:text-[18px]'>Product Panel</p>
            </div>
            <div className='flex flex-col justify-center items-center gap-4'>
                {products.map((product, index) => <ProductModal key={index} product={product} />)}
            </div>
        </div>
    )
}
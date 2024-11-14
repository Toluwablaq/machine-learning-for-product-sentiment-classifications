// import { IoSettingsOutline } from "react-icons/io5";
// import { IoNotificationsOutline } from "react-icons/io5";
import { MdProductionQuantityLimits } from "react-icons/md";


export const Nav = () => {
    return (
        <div className='bg-primary text-offWhite'>
            <div className='bg-primary text-offWhite flex justify-between items-center px-2 lg:px-8 py-5'>
                <div className='flex justify-center items-center gap-2'>
                    <MdProductionQuantityLimits className='text-secondary w-8 h-8' />
                    <p className='font-[600] lg:text-[19px] cursor-pointer'>Product Sentiment</p>
                </div>
                <div className='flex justify-between items-center gap-16'>
                  {/*  <button className='rounded-full px-3 py-1 text-[14px] bg-primary border-[1px] border-offWhite'>My Library</button>
                    <div className='flex justify-between items-center gap-5'>
                        <IoNotificationsOutline className='w-5 h-5 cursor-pointer' />
                        <IoSettingsOutline className='w-5 cursor-pointer h-5' />
                    </div> */}
                </div>
            </div>
            <div className='shadow-lg bg-gray-700 h-[1px] w-full'></div>
        </div>
    )
}
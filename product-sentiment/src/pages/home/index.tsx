import { useState, useEffect } from "react";
import { SideBar } from "../../components/SideBar";
import { Main } from "../../components/Main";
import { Nav } from "../../components/Nav";
import { Footer } from "../../components/Footer";

import config from "../../config.json";

export interface Product {
  id: string;
  image: string;
  name: string;
  last_comment_date: Date;
}

interface DashboardData {
  positive: number;
  negative: number;
  products: Product[];
  top_words: string[];
}
export const Home = () => {
  const [resData, setResData] = useState<DashboardData>();


      useEffect(() => {
        fetch(config.server_url + "/dashboard")
          .then((res) => res.json() as Promise<DashboardData>)
          .then((data) => {
            setResData(data);
          })
          .catch((error) => {
            console.error(error);
          });
      }, [setResData]);

    return (
      <>
        <div className="overflow-hidden lg:h-[100vh] font-poppins">
          <div className="hidden lg:grid grid-cols-10">
            <>
              <div className={`col-span-7 min-h-screen`}>
                {resData && (
                  <Main stats={[resData!.positive, resData!.negative]} />
                )}
              </div>
              <div className={`col-span-3 max-h-screen overflow-y-auto`}>
                {resData && <SideBar products={resData!.products} />}
              </div>
            </>
          </div>

          <div className="lg:hidden">
            <Nav />
            {resData && <Main stats={[resData!.positive, resData!.negative]} />}
            {resData && <SideBar products={resData!.products} />}
            <Footer />
          </div>
        </div>
      </>
    );
}
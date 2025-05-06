import { Pizza } from "lucide-react";

export default function DemoSection() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-5xl px-4 lg:px-8 sm:px-6 py-12 lg:py-24 lg:pt-12">
        <div></div> 
          <div className="flex flex-col items-center text-center space-y-4">
             <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-gray-100/80 backdrop-blur-xs border border-gray-500/20 mb-4">
              <Pizza className="h-6 w-6 text-rose-500"/>
              </div>
              <div>
                <h3 className="text-3xl font-bold mx-auto px-4 sm:px-6 max-w-3xl">
                  Watch how Concisco transforms {' '}
                  <span className="bg-linear-to-r from-rose-500 to-rose-700 bg-clip-text text-transparent">this Next.js course PDF</span> {' '}
                  into an
                  easy-to-read summary!
                </h3>
              </div>
              <div className="flex jsutify-center items-center px-2 sm:px-4 lg:px-6">
                {/* summary viewer */}
              </div>
          </div>      
      </div>  
    </section>
  )
}
"use client"
import React, { useState } from 'react'
import { useEffect} from 'react'
import axios from 'axios'
import MyChart from './MyChart';
import {ClipLoader} from 'react-spinners'
import toast,{Toaster} from 'react-hot-toast'



const Graph = () => {
    const [range,setRange] = useState<boolean>(false);
    const [forecast,setForecast] = useState<number>(0);
    const [startTime,setStartTime] =useState<string>('');
    const [endTime,setEndTime] =useState<string>('');
    const [actualPowerData,setActualPowerData] = useState<Array<Number>>();
    const [actualstartTime,setActualStartTime] = useState<Array<String>>();
    const [ForecastPowerData,setForecastPowerData] = useState<Array<Number>>();
    const [ForecaststartTime,setForecastStartTime] = useState<Array<String>>();


    const [isLoading,setIsLoading] = useState<boolean>(false);
    const [error,setIsError]=useState<boolean>(false);
  
  
    interface Item{
      dataset: String,
      fuelType: String,
      generation: Number,
      publishTime: String,
      settlementDate: String,
      settlementPeriod: Number,
      startTime: String
    }

    const handleClick=async()=>{
      try {
        setIsError(false)
       if(endTime===""||startTime===""){
        
        throw new Error("Please Input Date and Time")
       }
        setRange(true);
        setIsLoading(true);

        const [startDate,newStart] = startTime.split(' ');
        if(newStart===undefined){
          throw new Error("Please Enter Date and Time as Specified (YYYY-MM-DD HH:MM)")
        }
        const [hour,minutes] = newStart.split(':');
        const [endDate,newEnd] = endTime.split(' ');
        const [endhour,endminutes] = newEnd.split(':');

        if(newEnd===undefined || hour.length!==2 || minutes.length!==2 ||endhour.length!==2 || endminutes.length!==2){
          throw new Error("Please Enter Date and Time as Specified (YYYY-MM-DD HH:MM)")
        }

        const [startDateYear,startDateMonth,startDateDate] = startDate.split('-');
        const [endDateYear,endDateMonth,endDateDate] = endDate.split('-');
        if(Number(startDateYear)>Number(endDateYear)){
          throw new Error("Start Date Should be less than End Date");
        }
        if(Number(startDateYear)===Number(endDateYear)){
          if(Number(startDateMonth)>Number(endDateMonth)){
            throw new Error("Start Date Should be less than End Date");
          }
        }
        if(Number(startDateYear)===Number(endDateYear)){
          if(Number(startDateMonth)===Number(endDateMonth)){
            if(Number(startDateDate)>Number(endDateDate)){
              throw new Error("Start Date Should be less than End Date");
            }
          }
        }



       
        const response = await axios.get(`https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELHH/stream?publishDateTimeFrom=${startDate}T${hour}%3A${minutes}%3A00Z&publishDateTimeTo=${endDate}T${endhour}%3A${endminutes}%3A00Z&fuelType=WIND`)
        const ForeCastResponse = await axios.get(`https://data.elexon.co.uk/bmrs/api/v1/datasets/WINDFOR/stream?publishDateTimeFrom=${startDate}%20${hour}%3A${minutes}%3A00&publishDateTimeTo=${endDate}%20${endhour}%3A${endminutes}%3A00`)
        let newArr:Array<Number> = [];
        response.data.map((item:Item,index:Number)=>{
          newArr.unshift(item.generation);
         });

         let arra:Array<Number> = [];
         newArr.filter((item,index)=>{
          if(index%2==1){
            arra.unshift(item)
          }
         })
          setActualPowerData(arra);
          newArr=[];

        
        
    
          let newTime:Array<String>=[];
          response.data.map((item:Item,index:Number)=>{
            let a:String = item.startTime;
            let length:number = a.length;
            let indexOfT:number = a.indexOf('T');
            newTime.unshift(a.substring(indexOfT+1,length-1));
          });
          let newesTime:Array<String> =[];
          newTime.filter((item:String,index:number)=>{
            if(index%2==1){
              newesTime.unshift(item)
            }
          })
        setActualStartTime(newesTime);
        newTime=[];


         let newestArr:Array<Number> =[];
        ForeCastResponse.data.map((item:Item,index:Number)=>{
          newArr.unshift(item.generation);
         });
         newArr.filter((item:Number,index:number)=>{
          if(index>342 && newestArr.length<=23){
            newestArr.unshift(item);
          }

         })
          setForecastPowerData(newestArr);
    
          let newestTime:Array<String>=[];
          ForeCastResponse.data.map((item:Item,index:Number)=>{
            let a:String = item.startTime;
            let length:number = a.length;
            let indexOfT:number = a.indexOf('T');
            newTime.unshift(a.substring(indexOfT+1,length-1));
          });
          newTime.filter((item:String,index:number)=>{
            if(index>342 &&newestTime.length<=23)
            newestTime.push(item);
          })
        setForecastStartTime(newestTime);
     } catch (error:any) {
      setIsError(true);
      setIsLoading(true);
      console.log(error);
      if(error.response?.status===400)
        toast.error("Please Enter Valid Date and Time as Specified (YYYY-MM-DD HH:MM)");
      else{
        toast.error(error.message)

      }
            
      }
      finally{
        setIsLoading(false)
      }

    

    }
   if(ForecastPowerData){
    console.log(actualstartTime)
    console.log(ForecaststartTime);
   } 




  
   
  return (
    <div>
  <div className="flex flex-col sm:flex-row  sm:justify-evenly mt-4">
    <Toaster/>
 

         <div>
            <label htmlFor="">StartTime:</label>
            <div >
           
           <input value={startTime} onChange={(e)=>setStartTime(e.target.value)} className ='border p-3 rounded-md border-black cursor-pointer' placeholder='Example - YYYY-MM-DD 8:00'  />

       </div>
        </div>

        <div>
            <label htmlFor="">EndTime:</label>
            <div >
           <input value={endTime} onChange={(e)=>setEndTime(e.target.value)} className='border p-3 rounded-md border-black cursor-pointer' placeholder='Example - YYYY-MM-DD 8:00' />

           

       </div>
        </div>
        
       
        <div>
            <label htmlFor="">ForeCast Horizon:{`${forecast}h`}</label>
            <div className='mt-2 cursor-pointer'>
           
            <input  className='cursor-pointer' type='range'  min={0} max={48} value={forecast} step={1} onChange={(e)=>setForecast(Number(e.target.value))} />


       </div>

       
        </div>
        <div>
          <button onClick={handleClick} className='bg-blue-950 font-mono p-2 rounded-lg text-white mt-2'>
            Get Chart
          </button>
        </div>
    </div>
    {error?<div>
    <div className='flex justify-center mt-20'>
      <label className='font-semibold text-red-600 text-3xl'>Error!</label>
      
    </div>
    <div className='flex justify-center mt-2'>
      <span className='text-xl font-medium'>Please Try Again </span>
    </div>
    </div>
    
    :isLoading?<div className=' flex justify-center mt-20'>
      <div>
      <ClipLoader color="black"
        loading={isLoading}
        
        size={70}
        aria-label="Loading Spinner"/>
      </div>
      
    </div>
    :(range?<div className=' flex justify-center '>
      <div>
      <MyChart yData={actualPowerData!} xData={actualstartTime!} yfData={ForecastPowerData!} xfData={ForecaststartTime!}/>

      </div>
      
    </div>:"")
}
    </div>
  )
}

export default Graph

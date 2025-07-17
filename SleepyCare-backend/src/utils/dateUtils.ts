// פונקציה לחישוב משך הפגישה בדקות
export const calculateDuration = (start_time: Date, end_time: Date): number => {
    try{
    return (new Date(end_time).getTime() - new Date(start_time).getTime()) / (1000 * 60); // משך בדקות
    }
    catch (error: any) {
        throw new Error("Error calculating duration: ");
    }
};
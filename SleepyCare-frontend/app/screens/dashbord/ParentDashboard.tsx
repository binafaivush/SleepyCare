import AppBar from "@/app/components/common/AppBarPerentDashbord";
import { colors } from "../../constants";
import { Text } from "react-native";

export default function ParentDashboard() {

  return (<>
  <Text style={{ color: colors.pink, fontSize: 20, textAlign: 'center', marginVertical: 20 }}>
    Welcome to Parent Dashboard
  </Text>
  {/* <AppBar/> */}
 </> );
}
import "styled-components";
import { AppTheme } from "@/constants/Colors";

declare module "styled-components" {
  export interface DefaultTheme extends AppTheme {}
}

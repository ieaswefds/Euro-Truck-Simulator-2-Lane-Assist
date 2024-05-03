import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Card, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PluginFunctionCall } from "@/pages/server"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import ShowImage from "@/pages/modules/ShowImage"

import { GetSettingsJSON, SetSettingByKey } from "@/pages/settings"
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

export default function NavigationDetection({ ip }: { ip: string }) {

    const defaultLaneOffset = "0";
    const defaultLaneChangeSpeed = "1";
    const defaultLaneChangeWidth = "10";

    const {data, error, isLoading} = useSWR("NavigationDetection", () => GetSettingsJSON("NavigationDetection", ip));

    const [LaneOffset, setLaneOffset] = useState<string | undefined>(undefined);
    const[LeftHandTraffic, setLeftHandTraffic] = useState<boolean | undefined>(undefined);
    const [LaneChanging, setLaneChanging] = useState<boolean | undefined>(undefined);
    const [LaneChangeSpeed, setLaneChangeSpeed] = useState<string | undefined>(undefined);
    const [LaneChangeWidth, setLaneChangeWidth] = useState<string | undefined>(undefined);

    const [UseNavigationDetectionAI, setUseNavigationDetectionAI] = useState<boolean | undefined>(undefined);
    const [TryCUDA, setTryCUDA] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        if (data) {

            if (data.LaneOffset !== undefined) { setLaneOffset(data.LaneOffset); } else { setLaneOffset(defaultLaneOffset); }
            if (data.LeftHandTraffic !== undefined) { setLeftHandTraffic(data.LeftHandTraffic); } else { setLeftHandTraffic(false); }
            if (data.LaneChanging !== undefined) { setLaneChanging(data.LaneChanging); } else { setLaneChanging(true); }
            if (data.LaneChangeSpeed !== undefined) { setLaneChangeSpeed(data.LaneChangeSpeed); } else { setLaneChangeSpeed(defaultLaneChangeSpeed); }
            if (data.LaneChangeWidth !== undefined) { setLaneChangeWidth(data.LaneChangeWidth); } else { setLaneChangeWidth(defaultLaneChangeWidth); }

            if (data.UseNavigationDetectionAI !== undefined) { setUseNavigationDetectionAI(data.UseNavigationDetectionAI); } else { setUseNavigationDetectionAI(false); }
            if (data.TryCUDA !== undefined) { setTryCUDA(data.TryCUDA); } else { setTryCUDA(false); }

        }
    }, [data]);

    if (isLoading) return <p>Loading...</p>
    if (error) return <p className='p-4'>Lost connection to server - {error.message}</p>

    const UpdateLaneOffset = async (e:any) => {
        let newLaneOffset = String(e).replace(/\./g, ".");
        if (newLaneOffset.includes(".") && newLaneOffset.substring(newLaneOffset.indexOf(".") + 1).length > 1) { return; }
        let valid = !isNaN(parseFloat(newLaneOffset));
        if (valid) { if (parseFloat(newLaneOffset) < -15) { newLaneOffset = "-15"; } if (parseFloat(newLaneOffset) > 15) { newLaneOffset = "15"; } }
        toast.promise(SetSettingByKey("NavigationDetection", "LaneOffset", valid ? parseFloat(newLaneOffset) : parseFloat(defaultLaneOffset), ip), {
            loading: "Saving...",
            success: "Set value to " + parseFloat(newLaneOffset),
            error: "Failed to save"
        });
        setLaneOffset(newLaneOffset);
    };

    const UpdateLeftHandTraffic = async () => {
        let newLeftHandTraffic = !LeftHandTraffic;
        toast.promise(SetSettingByKey("NavigationDetection", "LeftHandTraffic", newLeftHandTraffic, ip), {
            loading: "Saving...",
            success: "Set value to " + newLeftHandTraffic,
            error: "Failed to save"
        });
        setLeftHandTraffic(newLeftHandTraffic);
    };

    const UpdateLaneChanging = async () => {
        let newLaneChanging = !LaneChanging;
        toast.promise(SetSettingByKey("NavigationDetection", "LaneChanging", newLaneChanging, ip), {
            loading: "Saving...",
            success: "Set value to " + newLaneChanging,
            error: "Failed to save"
        });
        setLaneChanging(newLaneChanging);
    };

    const UpdateLaneChangeSpeed = async (e:any) => {
        let newLaneChangeSpeed = String(e).replace(/\./g, ".");
        if (newLaneChangeSpeed.includes(".") && newLaneChangeSpeed.substring(newLaneChangeSpeed.indexOf(".") + 1).length > 1) { return; }
        let valid = !isNaN(parseFloat(newLaneChangeSpeed));
        if (valid) { if (parseFloat(newLaneChangeSpeed) < 0.1) { newLaneChangeSpeed = "0.1"; } if (parseFloat(newLaneChangeSpeed) > 3) { newLaneChangeSpeed = "3"; } }
        toast.promise(SetSettingByKey("NavigationDetection", "LaneChangeSpeed", valid ? parseFloat(newLaneChangeSpeed) : parseFloat(defaultLaneChangeSpeed), ip), {
            loading: "Saving...",
            success: "Set value to " + parseFloat(newLaneChangeSpeed),
            error: "Failed to save"
        });
        setLaneChangeSpeed(newLaneChangeSpeed);
    };

    const UpdateLaneChangeWidth = async (e:any) => {
        let newLaneChangeWidth = String(e).replace(/\,/g, ".");
        if (newLaneChangeWidth.includes(".") && newLaneChangeWidth.substring(newLaneChangeWidth.indexOf(".") + 1).length > 1) { return; }
        let valid = !isNaN(parseFloat(newLaneChangeWidth));
        if (valid) { if (parseFloat(newLaneChangeWidth) < 1) { newLaneChangeWidth = "1"; } if (parseFloat(newLaneChangeWidth) > 30) { newLaneChangeWidth = "30"; } }
        toast.promise(SetSettingByKey("NavigationDetection", "LaneChangeWidth", valid ? parseFloat(newLaneChangeWidth) : parseFloat(defaultLaneChangeWidth), ip), {
            loading: "Saving...",
            success: "Set value to " + parseFloat(newLaneChangeWidth),
            error: "Failed to save"
        });
        setLaneChangeWidth(newLaneChangeWidth);
    };

    const UpdateUseNavigationDetectionAI = async () => {
        let newUseNavigationDetectionAI = !UseNavigationDetectionAI;
        toast.promise(SetSettingByKey("NavigationDetection", "NavigationDetectionAI", newUseNavigationDetectionAI, ip), {
            loading: "Saving...",
            success: "Set value to " + newUseNavigationDetectionAI,
            error: "Failed to save"
        });
        setUseNavigationDetectionAI(newUseNavigationDetectionAI);
    };

    const UpdateTryCUDA = async () => {
        let newTryCUDA = !TryCUDA;
        toast.promise(SetSettingByKey("NavigationDetection", "TryCUDA", newTryCUDA, ip), {
            loading: "Saving...",
            success: "Set value to " + newTryCUDA,
            error: "Failed to save"
        });
        setTryCUDA(newTryCUDA);
    };

    return (
        <Card className="flex flex-col content-center text-center pt-10 space-y-5 pb-0 h-[calc(100vh-75px)] overflow-auto">

            <Popover>
                <PopoverTrigger asChild>
                    <CardHeader style={{ position: 'absolute', top: '43px', left: '-6px', width: '273px' }}>
                        <Button variant="secondary" style={{ fontWeight: 'bold' }}>NavigationDetection</Button>
                    </CardHeader>
                </PopoverTrigger>
                <PopoverContent style={{ position: 'relative', top: '-23px', left: '0px', height: '91px', width: '225px' }}>
                    <Label style={{ position: 'absolute', top: '12px', left: '10px', fontSize: '16px' }}>Created by</Label>
                    <Separator style={{ position: 'absolute', top: '40px', left: "0px" }}/>
                    <Label style={{ position: 'absolute', top: '57px', left: '46px', fontSize: '16px' }}>Glas42</Label>
                    <Avatar style={{ position: 'absolute', top: '49px', left: '8px', width: '32px', height: '32px' }}>
                        <AvatarImage src="https://avatars.githubusercontent.com/u/145870870?v=4"/>
                    </Avatar>
                </PopoverContent>
            </Popover>

            <Tabs defaultValue="general" style={{ position: 'absolute', top: '47px', left: '248px', right: '13.5pt' }}>
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="setup">Setup</TabsTrigger>
                    <TabsTrigger value="navigationdetectionai">NavigationDetectionAI</TabsTrigger>
                    <TabsTrigger value="showimage">Show Image</TabsTrigger>
                </TabsList>
                <TabsContent value="general">

                    <div className="flex flex-col gap-4 justify-start pt-2" style={{ position: 'absolute', left: '-227px', right: '2.5pt' }}>

                        {LaneOffset !== undefined && (
                        <div>
                            <div className="flex flex-row items-center text-left gap-2 pt-2">
                            <Input placeholder={String(defaultLaneOffset)} id="laneoffset" type="number" step="0.1" value={!isNaN(parseFloat(LaneOffset)) ? LaneOffset : ''}  onChangeCapture={(e) => UpdateLaneOffset((e.target as HTMLInputElement).value)} style={{ width: '75px' }}/>
                                <Label htmlFor="laneoffset">
                                    <span className="font-bold">Lane Offset</span><br />
                                    If the default lane offset is not correct, you can adjust it here.
                                </Label>
                            </div>
                            <div className="flex flex-row items-center text-left gap-2 pt-2">
                                <Slider value={[!isNaN(parseFloat(LaneOffset)) ? parseFloat(LaneOffset) : 0]} min={-15} max={15} step={0.1} onValueCommit={(e) => UpdateLaneOffset(e)} onValueChange={(e) =>setLaneOffset(String(e))}/>
                            </div>
                        </div>
                        )}

                        {LeftHandTraffic !== undefined && (
                        <div className="flex flex-row items-center text-left gap-2 pt-2">
                            <Switch id="lefthandtraffic" checked={LeftHandTraffic} onCheckedChange={UpdateLeftHandTraffic} />
                            <Label htmlFor="lefthandtraffic">
                                <span className="font-bold">Left-hand traffic</span><br />
                                Enable this if you are driving in a country with left-hand traffic.
                            </Label>
                        </div>
                        )}

                        {LaneChanging !== undefined && (
                        <div className="flex flex-row items-center text-left gap-2 pt-2">
                            <Switch id="lanechanging" checked={LaneChanging} onCheckedChange={UpdateLaneChanging} />
                            <Label htmlFor="lanechanging">
                                <span className="font-bold">Lane Changing</span><br />
                                If enabled, you can change the lane you are driving on using the indicators or the buttons you set in the Controls menu.
                            </Label>
                        </div>
                        )}

                        {LaneChangeSpeed !== undefined && (
                        <div>
                            <div className="flex flex-row items-center text-left gap-2 pt-2">
                            <Input placeholder={String(defaultLaneChangeSpeed)} id="lanechangespeed" type="number" step="0.1" value={!isNaN(parseFloat(LaneChangeSpeed)) ? LaneChangeSpeed : ''}  onChangeCapture={(e) => UpdateLaneChangeSpeed((e.target as HTMLInputElement).value)} style={{ width: '75px' }}/>
                                <Label htmlFor="lanechangespeed">
                                    <span className="font-bold">Lane Change Speed</span><br />
                                    This value determines the speed at which the vehicle will change lanes.
                                </Label>
                            </div>
                            <div className="flex flex-row items-center text-left gap-2 pt-2">
                                <Slider value={[!isNaN(parseFloat(LaneChangeSpeed)) ? parseFloat(LaneChangeSpeed) : 0]} min={0.1} max={3} step={0.1} onValueCommit={(e) => UpdateLaneChangeSpeed(e)} onValueChange={(e) =>setLaneChangeSpeed(String(e))}/>
                            </div>
                        </div>
                        )}

                        {LaneChangeWidth !== undefined && (
                        <div>
                            <div className="flex flex-row items-center text-left gap-2 pt-2">
                                <Input placeholder={String(defaultLaneChangeWidth)} id="lanechangewidth" type="number" step="0.1" value={!isNaN(parseFloat(LaneChangeWidth)) ? LaneChangeWidth : ''}  onChangeCapture={(e) => UpdateLaneChangeWidth((e.target as HTMLInputElement).value)} style={{ width: '75px' }}/>
                                <Label htmlFor="lanechangewidth">
                                    <span className="font-bold">Lane Change Width</span><br />
                                    This value determines the distance the vehicle needs to move either left or right to change one lane.
                                </Label>
                            </div>
                            <div className="flex flex-row items-center text-left gap-2 pt-2">
                                <Slider value={[!isNaN(parseFloat(LaneChangeWidth)) ? parseFloat(LaneChangeWidth) : 0]} min={1} max={30} step={0.1} onValueCommit={(e) => UpdateLaneChangeWidth(e)} onValueChange={(e) =>setLaneChangeWidth(String(e))}/>
                            </div>
                        </div>
                        )}

                    </div>

                </TabsContent>
                <TabsContent value="setup">

                    <div className="flex flex-col gap-4 justify-start pt-2" style={{ position: 'absolute', left: '-227px', right: '2.5pt' }}>

                        <div className="flex flex-row items-center text-left gap-2 pt-2">
                            <Button variant="outline" id="launchautomaticsetup" onClick={() => {toast.promise(PluginFunctionCall("NavigationDetection", "automatic_setup", [], {}), { loading: "Loading...", success: "Success", error: "Error" });}}>
                                Launch Automatic Setup
                            </Button>
                            <Label htmlFor="launchautomaticsetup">
                                The automatic setup will search for the minimap on your screen using AI (YOLOv5), it needs to download some files the first time you run it. Make sure that the minimap is always visible and not blocked by other applications.
                            </Label>
                        </div>

                        <div className="flex flex-row items-center text-left gap-2 pt-2">
                            <Button variant="outline" id="launchmanualsetup" onClick={() => {toast.promise(PluginFunctionCall("NavigationDetection", "manual_setup", [], {}), { loading: "Loading...", success: "Success", error: "Error" });}}>
                                Launch Manual Setup
                            </Button>
                            <Label htmlFor="launchmanualsetup">
                                The manual setup will take a screenshot of your screen and then ask you to select the route advisor and arrow position. You can take a look at the example image when you don't know what to do. The example image will open in another window.
                            </Label>
                        </div>

                    </div>

                </TabsContent>
                <TabsContent value="navigationdetectionai">

                    <div className="flex flex-col gap-4 justify-start pt-2" style={{ position: 'absolute', left: '-227px', right: '2.5pt' }}>

                        {UseNavigationDetectionAI !== undefined && (
                        <div className="flex flex-row items-center text-left gap-2 pt-2">
                            <Switch id="usenavigationdetectionai" checked={UseNavigationDetectionAI} onCheckedChange={UpdateUseNavigationDetectionAI} />
                            <Label htmlFor="usenavigationdetectionai">
                                <span className="font-bold">Use NavigationDetectionAI</span><br />
                                If enabled, the app will an AI instead of the regular NavigationDetection.
                            </Label>
                        </div>
                        )}

                        {TryCUDA !== undefined && (
                        <div className="flex flex-row items-center text-left gap-2 pt-2">
                            <Switch id="trycuda" checked={TryCUDA} onCheckedChange={UpdateTryCUDA} />
                            <Label htmlFor="trycuda">
                                <span className="font-bold">Run AI on GPU</span><br />
                                If enabled, the app will try to run the AI on your GPU using CUDA, if CUDA is not available, it will fallback to CPU.
                            </Label>
                        </div>
                        )}

                    </div>

                </TabsContent>
                <TabsContent value="showimage" className="h-full">
                    <div style={{ position: 'absolute', left: '-227px', right: '-2.5pt'}}>
                        <ShowImage ip={ip} plugin="NavigationDetection" />
                    </div>
                </TabsContent>

            </Tabs>

        </Card>
    )
}
from plugins.plugin import PluginInformation
from src.logger import print

PluginInfo = PluginInformation(
    name="PluginManager",
    description="Allows you to select different plugins.",
    version="0.1",
    author="Tumppi066",
    url="https://github.com/Tumppi066/Euro-Truck-Simulator-2-Lane-Assist",
    type="static"
)


from src.loading import LoadingWindow
import tkinter as tk
from tkinter import ttk
import src.helpers as helpers
from src.mainUI import quit, switchSelectedPlugin
import src.variables as variables
import src.settings as settings
import os
from PIL import Image, ImageTk

class UI():
    
    def findPlugins(self):
        print("Importing plugins...")
        loading = LoadingWindow("Importing plugins...")
        # Find plugins
        path = os.path.join(variables.PATH, "plugins")
        plugins = []
        for file in os.listdir(path):
            if os.path.isdir(os.path.join(path, file)):
                # Check for main.py
                if "main.py" in os.listdir(os.path.join(path, file)):
                    # Check for PluginInformation class
                    try:
                        pluginPath = "plugins." + file + ".main"
                        plugin = __import__(pluginPath, fromlist=["PluginInformation"])
                        if plugin.PluginInfo.type == "dynamic":
                            plugins.append(plugin.PluginInfo)
                            print("Found plugin: " + pluginPath)
                    except Exception as ex:
                        print(ex.args)
                        pass
        
        loading.destroy()
        return plugins
    

    
    def __init__(self, master) -> None:
        self.done = False
        self.master = master
        self.page0()
    
    def destroy(self):
        self.done = True
        self.root.destroy()
        del self

    
    def page0(self):
        
        #helpers.MakeLabel(self.master, "Welcome", 0,0, font=("Roboto", 20, "bold"), padx=30, pady=10, columnspan=2)
        
        try:
            self.root.destroy()
            del self.plugin
        except: pass
        
        self.root = tk.Canvas(self.master, width=600, height=520)
        self.root.grid_propagate(0)
        
        self.plugins = self.findPlugins()
        
        self.listVariable = tk.StringVar()
        self.listVariable.set([p.name for p in self.plugins])
        
        self.pluginList = tk.Listbox(self.root, width=20, height=20, listvariable=self.listVariable, font=("Roboto", 12), selectmode="single", activestyle="none")
        self.pluginList.grid(row=1, column=0, padx=10, pady=2)
        
        self.colorPlugins()
        
        helpers.MakeLabel(self.root, "Select a plugin to load:", 0,0, font=("Roboto", 8), padx=30, pady=10, columnspan=1)
        
        self.root.pack(anchor="center", expand=False)
        
        self.root.update()
    
    
    def colorPlugins(self):
        try:
            enabledPlugins = settings.GetSettings("Plugins", "Enabled")
        except:
            enabledPlugins = []
            
        # Set plugin colors
        colorTone = settings.GetSettings("User Interface", "Theme")
        if colorTone == None:
            colorTone = "dark"
        
        for i in range(len(self.plugins)):
            if self.plugins[i].name in enabledPlugins:
                self.pluginList.itemconfig(i, bg=f"{colorTone}green")
            else:
                self.pluginList.itemconfig(i, bg=f"red")
    
    
    def selectedPlugin(self, plugin):
        try:
            self.pluginInfoFrame.destroy()
        except:
            pass
        
        self.plugin = plugin
        
        self.pluginInfoFrame = ttk.LabelFrame(self.root, text=plugin.name, width=380, height=500)
        self.pluginInfoFrame.pack_propagate(0)
        self.pluginInfoFrame.grid_propagate(0)
        self.pluginInfoFrame.grid(row=0, column=1, padx=10, pady=2, rowspan=3)
        
        if plugin.image != None:
            # Load the logo
            self.logo = Image.open(os.path.join(variables.PATH, "plugins", plugin.name, plugin.image))
            # Resize to height keeping the aspect ratio
            height = 130
            self.logo = self.logo.resize((int(height*self.logo.width/self.logo.height), height), Image.ANTIALIAS)
            self.logo = ImageTk.PhotoImage(self.logo)
            self.logoLabel = tk.Label(self.pluginInfoFrame, image=self.logo)
            self.logoLabel.grid(row=0, column=0, columnspan=1, pady=10, padx=30)
            
            helpers.MakeLabel(self.pluginInfoFrame, plugin.name, 0,1, font=("Roboto", 16, "bold"), padx=10, pady=10, columnspan=1, sticky="w")
            
        else:
            helpers.MakeLabel(self.pluginInfoFrame, plugin.name, 0,0, font=("Roboto", 16, "bold"), padx=10, pady=10, columnspan=2, sticky="w")
            
        helpers.MakeLabel(self.pluginInfoFrame, "Description", 1,0, font=("Roboto", 12), padx=10, pady=10, columnspan=2, sticky="w")
        helpers.MakeLabel(self.pluginInfoFrame, plugin.description, 2,0, font=("Roboto", 8), padx=10, pady=2, columnspan=2, sticky="w")
        helpers.MakeLabel(self.pluginInfoFrame, "Version", 3,0, font=("Roboto", 12), padx=10, pady=10, columnspan=2, sticky="w")
        helpers.MakeLabel(self.pluginInfoFrame, plugin.version, 4,0, font=("Roboto", 8), padx=10, pady=2, columnspan=2, sticky="w")
        helpers.MakeLabel(self.pluginInfoFrame, "Author", 5,0, font=("Roboto", 12), padx=10, pady=10, columnspan=2, sticky="w")
        helpers.MakeLabel(self.pluginInfoFrame, plugin.author, 6,0, font=("Roboto", 8), padx=10, pady=2, columnspan=2, sticky="w")
        helpers.MakeLabel(self.pluginInfoFrame, "URL", 7,0, font=("Roboto", 12), padx=10, pady=10, columnspan=2, sticky="w")
        helpers.MakeLabel(self.pluginInfoFrame, plugin.url, 8,0, font=("Roboto", 8), padx=10, pady=2, columnspan=2, sticky="w")
        helpers.MakeLabel(self.pluginInfoFrame, "Update point", 9,0, font=("Roboto", 12), padx=10, pady=10, columnspan=2, sticky="w")
        helpers.MakeLabel(self.pluginInfoFrame, plugin.dynamicOrder, 10,0, font=("Roboto", 8), padx=10, pady=2, columnspan=2, sticky="w")

        if plugin.name in settings.GetSettings("Plugins", "Enabled"):
            helpers.MakeButton(self.pluginInfoFrame, "Disable plugin", lambda: self.disablePlugin(plugin), 11, 0, width=15, padx=8)
        else:
            helpers.MakeButton(self.pluginInfoFrame, "Enable plugin", lambda: self.enablePlugin(plugin), 11, 0, width=15, padx=8)
        helpers.MakeButton(self.pluginInfoFrame, "Load plugin UI", lambda: switchSelectedPlugin("plugins." + plugin.name + ".main"), 11, 1, width=15, padx=8)        
        
    
    def disablePlugin(self, plugin):
        settings.RemoveFromList("Plugins", "Enabled", plugin.name)
        self.page0()
        helpers.MakeLabel(self.root, "Restart Required", 11, 0, font=("Roboto", 12, "bold"), padx=10, pady=2, columnspan=1, sticky="n")
        
    def enablePlugin(self, plugin):
        settings.AddToList("Plugins", "Enabled", plugin.name)
        self.page0()
        helpers.MakeLabel(self.root, "Restart Required", 11, 0, font=("Roboto", 12, "bold"), padx=10, pady=2, columnspan=1, sticky="n")
    
    def update(self):
        try:
            if self.plugins[self.pluginList.curselection()[0]].name != self.plugin.name:
                self.selectedPlugin(self.plugins[self.pluginList.curselection()[0]])
        except:
            try:
                self.plugin
            except:
                self.selectedPlugin(self.plugins[0])
        
        self.root.update()
    
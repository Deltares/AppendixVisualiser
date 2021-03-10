import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import matplotlib as mpl
import matplotlib.dates as mdates
from matplotlib import colors as mplcolors
import json
from datetime import datetime, timedelta
from typing import Union
from pathlib import Path 
from copy  import copy



class ExportToAV:
    linestyle_map = {"-": "solid", 
                     "-.": "dashdot", 
                     '--': "dash",
                     ":": "dot"}

    marker_map = {"o": "circle",
                  "s": "square",
                  "v": "triangle-down",
                  "^": "triangle-up",
                  "<": "triangle-left",
                  ">": "triangle-right",
                  "1": "y-down"}

    def __init__(self, figures:list=None):
        self._output_dict = {"reference":"Add reference to report",
                             "contact":"koen.berends@deltares.nl",
                             "appendices":[]}

        
        if figures is not None:
            self.addAppendix(name="appendix")
            self.addFiguresToAppendix(figures, 0)

    def to_json(self, path:Union[str, Path]):
        with open(path, 'w') as f:
            json.dump(self._output_dict, f, indent=2)

    def addAppendix(self, name:str="appendix", paragraph:str=None):
        if paragraph is None:
            paragraph = r"""# About
Use this section to describe the figures or tables in this appendix. 
This section supports markdown code, like **bold text**,  *italicized text*,
    > blockquote
and more
## header 2
sample text
### header 3
sample text
"""

        appendix_dict = {"name": name, "paragraphs":list(), "graphs":list()}
        appendix_dict['paragraphs'] = paragraph
        self._output_dict.get('appendices').append(appendix_dict)

    def getAppendix(self, index):
        return self._output_dict.get('appendices')[index]

    def setAppendix(self, index, appendix_dict):
        self._output_dict.get('appendices')[index] = appendix_dict

    def setParagraph(self, markdown:str, appendix_index:int=0):
        """
        Add a paragraph (description) to an appendix. 

        markdown: str with markdown markup

        """
        self._output_dict.get('appendices')[appendix_index]['paragraphs'] = paragraph

    def addFiguresToAppendix(self, figs, appendix:Union[int, str]=0):
        if isinstance(appendix, str):
            appendix = self._get_appendix_index_by_name(appendix)

        appendix_dict = self.getAppendix(appendix)
        for fig in figs:
            for ax in fig.axes:
                # get lines
                title = ax.get_title()
                xlim = self._get_xlim(ax)
                appendix_dict.get("graphs").append(
                        {"xlabel": ax.get_xlabel(),
                         "ylabel": ax.get_ylabel(),
                         "xlim": xlim,
                         "ylim": ax.get_ylim(),
                         "title": title,
                         "data": []
                        }
                        )
                for line in ax.lines:
                    color = line.get_color()
                    mode = self._get_mode(line)
                    
                    
                    try:
                        dash = self.linestyle_map.get(line.get_linestyle())
                    except KeyError:
                        print (f"linestyle {dash} not supported")
                        dash = "solid"
                    
                    try:
                        marker_symbol = self.marker_map.get(line.get_marker())
                    except KeyError:
                        print (f"marker symbol {marker_symbol} not supported")
                        dash = "circle"

                    # Get xy data
                    xdata = line.get_xdata()
                    ydata = line.get_ydata()
                    xdata, ydata = self._transform_to_data_coordinates(line, xdata, ydata, ax)

                    # Convert timeseries
                    if isinstance(xdata[0], datetime):
                        xdata = [t.strftime("%Y-%m-%d %H:%M:%S") for t in line.get_xdata()] 
                    if isinstance(xdata[0], np.datetime64):
                        xdata = [pd.to_datetime(t).strftime("%Y-%m-%d %H:%M:%S") for t in line.get_xdata()] 
                    
                    # convert np.float32 types (these are not serialiazble, but float64 is..)
                    if isinstance(xdata[0], np.float32): 
                        xdata = [np.float64(x) for x in xdata]
                    if isinstance(ydata[0], np.float32): 
                        ydata = [np.float64(y) for y in ydata]

                    
                    appendix_dict.get('graphs')[-1].get('data').append(
                        {'x': list(xdata),
                        'y': list(ydata),
                        "mode": mode,
                        "name": line.get_label(),
                        "line": {"color": f"rgb{mplcolors.to_rgb(color)}", 
                                "dash": dash,
                                "width": line.get_linewidth()*1},
                        "marker" :  {"symbol": marker_symbol,
                                    "color": mplcolors.to_rgb(line.get_markerfacecolor()),
                                    "size": line.get_markersize(),
                                    "line": {'color': mplcolors.to_rgb(line.get_markeredgecolor()),
                                             'width': line.get_markeredgewidth()}
                        }}
                    )
                for text in ax.texts:

                    appendix_dict.get('graphs')[-1].get('data').append(
                        {'x': [text._x],
                         'y': [text._y],
                         "mode": "text",
                         "text": [text._text],
                         "textposition": self._get_textposition(text),
                         "textfont": {"color": f"rgb{mplcolors.to_rgb(text._color)}"}
                        }
                    )
                
        
        self.setAppendix(appendix, appendix_dict)

    def _get_textposition(self, textobject):
        th = textobject._horizontalalignment
        tv = textobject._verticalalignment

        alignment_map = {"baseline": "bottom",
                         "top": "top",
                         "left": "left",
                         "right": "right",
                         "bottom": "bottom",
                         "center": "center"
                        }
        return f"{alignment_map[th]} {alignment_map[tv]}"

    def _get_mode(self, line):
        if line.get_marker() is 'None':
            return "lines"
        elif (line.get_marker() is not 'None') and (line.get_linestyle() is not 'None'):
            return "lines+markers"
        else:
            return "markers"

    def _ax_is_datetime(self, ax):
        for line in ax.lines:
            if isinstance(line.get_xdata()[0], (datetime, np.datetime64)):
                return True
        return False

    def _get_xlim(self, ax):
        xlim = ax.get_xlim()
        if self._ax_is_datetime(ax):
            xlim = [mdates.num2date(xl).strftime("%Y-%m-%d %H:%M:%S") for xl in xlim]

        return xlim

    def _transform_to_data_coordinates(self, obj, xdata, ydata, ax):
        
        if obj.get_transform() != obj.axes.transData:
            points = np.array([xdata, ydata]).T
            transform = mpl.transforms.composite_transform_factory(
                obj.get_transform(), obj.axes.transData.inverted()
            )
            transfdata =  transform.transform(points).T
            if self._ax_is_datetime(ax):
                transfdata = [[mdates.num2date(xl).strftime("%Y-%m-%d %H:%M:%S") for xl in transfdata[0]],
                              transfdata[1]]
            return np.array(transfdata)
        return xdata, ydata

    def _get_appendix_index_by_name(self, appendixname):
        for i, ap in enumerate(self._output_dict.get("appendices")):
            if ap['name'] == appendixname:
                return i
        
        # if not returned by now, appendix is unknown
        raise IndexError(f"unknown appendix '{appendixname}'")
# Tests 
if __name__ == "__main__":
    """
    Test Cases
    """
    figs = []

    # TEST CASE 1: LINESTYLES
    # ------------------------------------
    fig, ax = plt.subplots(1)

    x = np.linspace(0, 2*np.pi, 100)

    ax.plot(x, np.sin(x), '-', color='m', label='Solid')
    ax.plot(x, np.cos(x), '-.', color="b", label='Dot-Dash')
    ax.plot(x, np.cos(x+0.25*np.pi), '--', color="y", label='Dashed')
    ax.plot(x, np.cos(x+0.5*np.pi), linestyle='dotted', color="r", label='Dotted')
    ax.set_title('Linestyles')

    figs.append(fig)

    # TEST CASE 2: COLOURS
    # ------------------------------------
    fig, ax = plt.subplots(1)

    x = np.linspace(0, 2*np.pi, 100)

    for s in np.linspace(0, np.pi, 10):
        ax.plot(x, np.sin(x+s), '-', color=plt.cm.viridis(s/np.pi))
    ax.set_title('Colors')

    figs.append(fig)
    
    # TEST CASE 3: LineWidths
    # ------------------------------------
    fig, ax = plt.subplots(1)

    x = np.linspace(0, 2*np.pi, 100)

    # test if float32 are correctly handled
    x = np.array([np.float32(xi) for xi in x])

    for s in np.linspace(0, np.pi, 10):
        ax.plot(x, np.sin(x+s), '-', linewidth=5*s/np.pi)
    ax.set_title('LineWidths')

    figs.append(fig)

    # TEST CASE 4: TimeSeries
    # ------------------------------------
    fig, ax = plt.subplots(1)
    start_t = datetime(year=2020, month=1, day=1)
    x = np.linspace(0, 2*np.pi, 50)
    t = [start_t+i for i in map(timedelta, x)]

    ax.plot(t, np.sin(x)/2, '--', color='r', label='sin2(x)', linewidth=3)
    ax.plot(t, np.cos(x), '.-', color="c", label='Cos2ine')
    ax.set_xlabel('Time')
    ax.set_ylabel('Energy')
    ax.set_title('TimeSeries')

    figs.append(fig)

    # TEST CASE 5: AXHLINE
    # ------------------------------------
    fig, ax = plt.subplots(1)
    start_t = datetime(year=2020, month=1, day=1)
    x = np.linspace(0, 2*np.pi, 50)
    t = [start_t+i for i in map(timedelta, x)]

    
    ax.plot(t, np.sin(x)/2, '--', color='r', label='sin2(x)', linewidth=3)
    ax.plot(t, np.cos(x), '.-', color="c", label='Cos2ine')
    ax.axhline(y=0.5)
    ax.set_xlabel('Time')
    ax.set_ylabel('Energy')
    ax.set_title('HLINES')

    figs.append(fig)


    # TEST CASE 5: Markers
    # ------------------------------------
    fig, ax = plt.subplots(1)
    start_t = datetime(year=2020, month=1, day=1)
    x = np.linspace(0, 2*np.pi, 10)
    
    markers = list(ExportToAV.marker_map.keys())
    for s, marker in zip(np.linspace(0, np.pi, len(markers)), markers):
        ax.plot(x, np.sin(x+s), linestyle='None', marker=marker, linewidth=5*s/np.pi, label=marker)

    ax.set_title('Markers')

    figs.append(fig)

    # TEST CASE 6: Annotations
    # ------------------------------------
    fig, ax = plt.subplots(1)
    start_t = datetime(year=2020, month=1, day=1)
    x = np.linspace(0, 2*np.pi, 10)
    
    ax.plot(x, np.sin(x)) # just someline

    ax.text(x[5], np.sin(x)[5], 'Half Way')
    ax.text(8, 1, 'Out of ax')
    ax.set_title('Annotations')

    figs.append(fig)


    # How to Use Export
    # ------------------------------------

    # ExportToAV(figs).to_json("ExportToAV.json")

    exporter = ExportToAV()
    exporter.addAppendix(name="Figures")
    exporter.addFiguresToAppendix(figs, "Figures")
    exporter.to_json("ExportToAV.json")





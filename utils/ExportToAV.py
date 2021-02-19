import matplotlib.pyplot as plt
import numpy as np
from matplotlib import colors as mplcolors
import json
from datetime import datetime, timedelta
from typing import Union, List
from pathlib import Path 


class ExportToAV:
    """
    Use this class to export Matplotlib figures to a json datafile. 

    Usage:

    >>> from ExportToAV import ExportToAV
    >>> # Some Python code that generates list of figures
    >>> ExportAV(figs).to_json('exporttoav.json')

    """
    def __init__(self, figures:list=None):

        self._output_dict = {"reference":"Add reference to report",
                             "contact":"koen.berends@deltares.nl",
                             "appendices":[]}

        self._addAppendix()
        if figures is not None:
            self._addFiguresToAppendix(figures, 0)

    def to_json(self, path:Union[str, Path]):
        """
        Exports figures to json file. 

        Arguments:
            path (str): Path or pathstring to desired json file
        """

        with open(path, 'w') as f:
            json.dump(self._output_dict, f, indent=2)
 
    def _addAppendix(self):
        paragraph_dict = {"header": "Header 1", "body": r"This body support HTML tags, like <b>bold</b>, <i>italics</i>,  <a href='https://ncr-web.org'>links </a> and more. <br/> <h2> Header 2 </h2> Use it to explain the figures accessible below.  "}
        appendix_dict = {"paragraphs":list(), "graphs":list()}
        appendix_dict.get('paragraphs').append(paragraph_dict)
        self._output_dict.get('appendices').append(appendix_dict)

    def _getAppendix(self, index:int):
        return self._output_dict.get('appendices')[index]

    def _setAppendix(self, index:int, appendix_dict:dict):
        self._output_dict.get('appendices')[index] = appendix_dict

    def _addFiguresToAppendix(self, figs:List[plt.figure], appendix:int=0):
        appendix_dict = self._getAppendix(appendix)
        for fig in figs:
            for ax in fig.axes:
                # get lines
                appendix_dict.get("graphs").append(
                        {"xlabel": ax.get_xlabel(),
                        "ylabel": ax.get_ylabel(),
                        "title": ax.get_title(),
                        "data": []
                        }
                        )
                for line in ax.lines:
                    color = line.get_color()
                    
                    if line.get_marker() is None:
                        mode = "lines"
                    elif (line.get_marker() is not None) and (line.get_linestyle() is not None):
                        mode = "lines+markers"
                    else:
                        mode = "markers"
                    linestyles = {"-": "solid", 
                                  "-.": "dashdot", 
                                  '--': "dash",
                                  ":": "dot"}
                    try:

                        dash = linestyles.get(line.get_linestyle())
                    except KeyError:
                        print (f"linestyle {dash} not supported")
                        dash = "solid"
                    
                    xdata = line.get_xdata()
                    if isinstance(xdata[0], datetime):
                        xdata = [t.strftime("%Y-%m-%d %H:%M:%S") for t in line.get_xdata()] 
                    appendix_dict.get('graphs')[-1].get('data').append(
                        {'x': list(xdata),
                        'y': list(line.get_ydata()),
                        "mode": "lines",
                        "name": line.get_label(),
                        "line": {"color": f"rgb{mplcolors.to_rgb(color)}", 
                                "dash": dash,
                                "width": line.get_linewidth()}
                        }
                    )
                
        
        self._setAppendix(appendix, appendix_dict)
        

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

    # How to Use Export
    # ------------------------------------
    ExportToAV(figs).to_json("ExportToAV.json")




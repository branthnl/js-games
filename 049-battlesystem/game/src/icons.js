const ICONS = {
	"items": [{
		"icon": "data:image/png;base64,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", "name": "Guogiqdbha", "symbol": "MDI"
	},
	{
		"icon": "https://chronobot.io/gg_png/2.png", "name": "Aqefwemyzj", "symbol": "BUT"
	},
	{
		"icon": "https://chronobot.io/gg_png/3.png", "name": "Rskraiaiid", "symbol": "VSH"
	},
	{
		"icon": "https://chronobot.io/gg_png/4.png", "name": "Aopspcjoiw", "symbol": "XHE"
	},
	{
		"icon": "data:image/png;base64,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", "name": "Zgbmcvijzm", "symbol": "AEO"
	},
	{
		"icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC70lEQVR42r2Xy24TMRSGz+RKSEtRVGiEigQSXSCEEELiIm5LJFjxGrRpkg0bFogFG1ZVA6zY8ARs2PAUIFQIbYNKoVBQuSQkoUnGY+Nje5yZJmk8UidHsuxOJvN//s/xmdQCw4jdBmZ6L3kBM3z6zkdj2L1WEIB79+8Ove/hg0cIMMeXr/io7DnA8fQMOMwBwoicqa3/bpCaC7DAv/Kcjzd7DjCdOiYE5SBgKwAcLdoMHyC7b1oIy913Z+EIdMIHmExMafsd6oDNlAMcwoqw8AEm4hmxY8qoAMEUUFUDiWgsfIB09EDX8h1FmI6nwgdIWCkprvIvUiDWFCaS4+EDAItqy10HCJWnYDKVCQ4QpMMhAHGopw8QIY5rhMrunxIApoEd0zLtcG5sk7Z0QAmj/V//bcDm9je4efSW8XPcjqkBDiePyB15jhgROyS+617L15trsNH8LMTxVOwa3GeGgzCYOzOvU6UBMolDvsbit5lom22+RtFPSnxoqAQjH3OYAMidy/cCjMcOdnetxFAYq9y1/Fd7Cz7WK7DeWIMO7Zh5zbri1OYANkD+Uh+AVGTMZ7nrgDznFFb/LkOlvgJ/2r+N8yzFcdcAlKA4h+Dr4tVCL0AMkn0tr3aqsFL7AKv15eF5HiRuq9078nrxWh8AYBFPh5PH60drE8rVd6LKAwVT+XaUeIeJNOB1KwJQuNIHwHb8ln/hBVauLcHP1lYwYSw6Kq1m7s6J/NiKYuOxIH+xTw2YxtNyaeBnd07mjJ/jAzD9EoIOAkCLZ0/lgnbCBXwXnODjhpoHBgctDAIQ+eW2z57WDeYlmP0orSDAGB9ZNe8G8LoHwM05nnFecLmzGuAZmP0obQR+G2qAHQWHlZ6/kA//dSwA3PYquhuoDsd8xytUADfnXnE888XrowB4X5I7V7a74vgkb4cLDeDJUkm80VBcdziQTaZweQQAj98udsU9HS4St2D+/AiKcFiECmB6bygAYNgxVWADMvrv+D+CLE5zI/TmYwAAAABJRU5ErkJggg==", "name": "Nnhqhqmosx", "symbol": "BZV"
	},
	{
		"icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABRElEQVR42u2XsWrCUBRAlYJTQXB1EiwURHEQXOzkVPQLFAcn0S8wX5AuXZuxILRfoPQD7FLoIBZB0ElwFQRxEAqeYAsdqjXPm1yEPricLeckIXATDimf8FkHRDP2JbhfDq2GVoAN8kyZiHWgAciT4IUpIp8F/gQI6AIHec/0GsYByEugibx8itwoAHkEjJhbAqYaAW0XyK1T5Z4DkMfBG3NNwEoj4An0kD9LyD0FIC8AG/mNlPzoAOQX4J2pEzDQCGiCNPKWpPyoAOQxMGGuCFhoBDyAD+SOtPzPAORZ8MjkCPjUCOgDC/mrH/KDAcgroIS86pd8b8DXojFm8gTMNQLcRWOJ/M5P+a8BPxaNFAEbjQCRRcMoQHLR8BwgvWiYBIguGp4C/Fg0Dh18idDuK1t8B3RALcg757ivOXXev2b/ARJnC0GDfOu8Z2jvAAAAAElFTkSuQmCC", "name": "Zczthlefrq", "symbol": "RGG"
	},
	{
		"icon": "https://chronobot.io/gg_png/8.png", "name": "Hwsqulraop", "symbol": "QYR"
	},
	{
		"icon": "https://chronobot.io/gg_png/9.png", "name": "Uffdjbqdwe", "symbol": "CXC"
	},
	{
		"icon": "https://chronobot.io/gg_png/10.png", "name": "Iiygcodrlz", "symbol": "EJV"
	},
	{
		"icon": "https://chronobot.io/gg_png/11.png", "name": "Slcrvwmegv", "symbol": "PEM"
	},
	{
		"icon": "https://chronobot.io/gg_png/12.png", "name": "Tadeyzplsg", "symbol": "OQW"
	},
	{
		"icon": "https://chronobot.io/gg_png/13.png", "name": "Zsjnjvefxm", "symbol": "ZYY"
	},
	{
		"icon": "https://chronobot.io/gg_png/14.png", "name": "Fsuykreoid", "symbol": "QPK"
	},
	{
		"icon": "https://chronobot.io/gg_png/15.png", "name": "Uksuaiclhp", "symbol": "VDD"
	},
	{
		"icon": "https://chronobot.io/gg_png/16.png", "name": "Gjyrkdlmln", "symbol": "XGQ"
	},
	{
		"icon": "https://chronobot.io/gg_png/17.png", "name": "Ihpoxnolxf", "symbol": "WOY"
	},
	{
		"icon": "https://chronobot.io/gg_png/18.png", "name": "Xcwngnphsc", "symbol": "FCR"
	},
	{
		"icon": "https://chronobot.io/gg_png/19.png", "name": "Vmnkzzbryq", "symbol": "MOS"
	},
	{
		"icon": "https://chronobot.io/gg_png/20.png", "name": "Dlkalvqzoo", "symbol": "QHZ"
	},
	{
		"icon": "https://chronobot.io/gg_png/21.png", "name": "Nulmqqjhqm", "symbol": "CKP"
	},
	{
		"icon": "https://chronobot.io/gg_png/22.png", "name": "Jitkoekjvy", "symbol": "WHI"
	},
	{
		"icon": "https://chronobot.io/gg_png/23.png", "name": "Ngocetnixi", "symbol": "YMX"
	},
	{
		"icon": "https://chronobot.io/gg_png/24.png", "name": "Gthwnzaqrm", "symbol": "UDR"
	},
	{
		"icon": "https://chronobot.io/gg_png/25.png", "name": "Zroudrtjdb", "symbol": "XWW"
	},
	{
		"icon": "https://chronobot.io/gg_png/26.png", "name": "Ssgffqhwcz", "symbol": "LVP"
	},
	{
		"icon": "https://chronobot.io/gg_png/27.png", "name": "Hkcanpmxmc", "symbol": "BRN"
	},
	{
		"icon": "https://chronobot.io/gg_png/28.png", "name": "Lxgrwwjniu", "symbol": "EPZ"
	},
	{
		"icon": "https://chronobot.io/gg_png/29.png", "name": "Olxmfunzzq", "symbol": "NHN"
	},
	{
		"icon": "https://chronobot.io/gg_png/30.png", "name": "Rdvovyulja", "symbol": "KJM"
	},
	{
		"icon": "https://chronobot.io/gg_png/31.png", "name": "Xdpvuctakj", "symbol": "VXP"
	},
	{
		"icon": "https://chronobot.io/gg_png/32.png", "name": "Ptnoatapzn", "symbol": "DGB"
	},
	{
		"icon": "https://chronobot.io/gg_png/33.png", "name": "Pyrzoeeqxp", "symbol": "KIK"
	},
	{
		"icon": "https://chronobot.io/gg_png/34.png", "name": "Gbtmkcyumr", "symbol": "OCU"
	},
	{
		"icon": "https://chronobot.io/gg_png/35.png", "name": "Xwkndgypzr", "symbol": "OED"
	},
	{
		"icon": "https://chronobot.io/gg_png/36.png", "name": "Xkeubhsbgl", "symbol": "OTD"
	},
	{
		"icon": "https://chronobot.io/gg_png/37.png", "name": "Xuukrkcyos", "symbol": "KSE"
	},
	{
		"icon": "https://chronobot.io/gg_png/38.png", "name": "Gsmfjbdeho", "symbol": "RUA"
	},
	{
		"icon": "https://chronobot.io/gg_png/39.png", "name": "Uzxbfbfiqu", "symbol": "POS"
	},
	{
		"icon": "https://chronobot.io/gg_png/40.png", "name": "Tjqnltjqza", "symbol": "NZW"
	},
	{
		"icon": "https://chronobot.io/gg_png/41.png", "name": "Tzpxgjjjza", "symbol": "YHU"
	},
	{
		"icon": "https://chronobot.io/gg_png/42.png", "name": "Osctxzljac", "symbol": "ZZU"
	},
	{
		"icon": "https://chronobot.io/gg_png/43.png", "name": "Lrxtfslvqm", "symbol": "VNC"
	},
	{
		"icon": "https://chronobot.io/gg_png/44.png", "name": "Dfynycpblz", "symbol": "OCR"
	},
	{
		"icon": "https://chronobot.io/gg_png/45.png", "name": "Pmoqugvoyt", "symbol": "LOF"
	},
	{
		"icon": "https://chronobot.io/gg_png/46.png", "name": "Oxjpbpomfk", "symbol": "CMP"
	},
	{
		"icon": "https://chronobot.io/gg_png/47.png", "name": "Bpoqpjtzzc", "symbol": "TFU"
	},
	{
		"icon": "https://chronobot.io/gg_png/48.png", "name": "Jhitwpvugx", "symbol": "LJQ"
	},
	{
		"icon": "https://chronobot.io/gg_png/49.png", "name": "Pytvkeabyq", "symbol": "GZZ"
	},
	{
		"icon": "https://chronobot.io/gg_png/50.png", "name": "Gjbpgfazrp", "symbol": "CGN"
	},
	{
		"icon": "https://chronobot.io/gg_png/51.png", "name": "Pktrujxzjg", "symbol": "MMR"
	},
	{
		"icon": "https://chronobot.io/gg_png/52.png", "name": "Uczaybzjnm", "symbol": "FUD"
	},
	{
		"icon": "https://chronobot.io/gg_png/53.png", "name": "Btrfcbmmys", "symbol": "VJE"
	},
	{
		"icon": "https://chronobot.io/gg_png/54.png", "name": "Wssojielji", "symbol": "UKO"
	},
	{
		"icon": "https://chronobot.io/gg_png/55.png", "name": "Gagkbjlbpw", "symbol": "CQF"
	},
	{
		"icon": "https://chronobot.io/gg_png/56.png", "name": "Twptbesahp", "symbol": "RAT"
	},
	{
		"icon": "https://chronobot.io/gg_png/57.png", "name": "Mqkivfshjb", "symbol": "WLC"
	},
	{
		"icon": "https://chronobot.io/gg_png/58.png", "name": "Ayxnqjkpec", "symbol": "SXW"
	},
	{
		"icon": "https://chronobot.io/gg_png/59.png", "name": "Dugzqyfppn", "symbol": "HZN"
	},
	{
		"icon": "https://chronobot.io/gg_png/60.png", "name": "Iznxekravr", "symbol": "ZWU"
	}]
};
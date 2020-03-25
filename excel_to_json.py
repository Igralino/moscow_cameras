import pandas
import re
from geojson import Feature, Point, FeatureCollection, dumps

regex = re.compile(r'\d+\.\d+')

features = []
version_num = 0
for year in range(2016, 2021):
    for version in range(1, 6):
        need_increment = False
        for data_type in ["court", "mass", "porch", "road"]:
            url = "data/" + str(year) + "/" + data_type + "/" + str(version) + ".xlsx"
            try:
                excel_data_df = pandas.read_excel(url, sheet_name='Sheet0')
                print(url)
                values = []
                if "Геоданные" in excel_data_df:
                    values = excel_data_df["Геоданные"].values
                if "geoData" in excel_data_df:
                    values = excel_data_df["geoData"].values
                if len(values) == 0:
                    print(excel_data_df)
                    exit(0)
                for value in values:
                    try:
                        floats = [float(i) for i in regex.findall(value)]
                        if len(floats) == 0:
                            print("NOT PARSED")
                            exit(0)
                        need_increment = True
                        features.append(Feature(geometry=Point(tuple(floats)),
                                                properties={"data_type": data_type,
                                                            "year": year,
                                                            "version": version_num}))
                    except:
                        print(value)
            except FileNotFoundError:
                pass
        print(version_num)
        if need_increment:
            version_num += 1


collection = FeatureCollection(features)
dump = dumps(collection)

with open("data.geojson", 'w') as f:
    f.write(dump)

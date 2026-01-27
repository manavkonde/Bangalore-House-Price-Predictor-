import pandas as pd
import numpy as np
import matplotlib.pyplot as plt 
import matplotlib


matplotlib.rcParams["figure.figsize"] = (20, 10)

df1=pd.read_csv('bengaluru.csv')
#print(df1.head())
#print(df1.shape)
a=df1.groupby("area_type")["area_type"].agg('count')
#print(a)

df2=df1.drop(["area_type","society","balcony","availability"],axis="columns")

#print(df2.head())
df2.isnull().sum()
#print(df2.isnull().sum())

df3=df2.dropna()
#print(df3.isnull().sum())

df3['size'].unique()
#print unique value

df3 = df2.dropna().copy()
df3["bhk"] = df3["size"].apply(lambda x: int(x.split(" ")[0]))
#new column created

#print(df3)
df3['bhk'].unique()
#print(df3['bhk'].unique()) print unique

df3[df3.bhk>20]
#print(df3[df3.bhk>20])

df3.total_sqft.unique()
#print(df3.total_sqft.unique())

def is_float(x):
    try:
        float(x)
    except:
        return False
    return True
c=df3[~df3['total_sqft'].apply(is_float)].head()
#print(c)

def convert_sqft_to_num(x):
    tokens=x.split('-')
    if len(tokens)==2:
        return(float(tokens[0])+float(tokens[1]))/2
    try:
        return float(x)
    except:
        return None
    
# v=convert_sqft_to_num('2000sq.meter')
# print(v)

df4=df3.copy()
df4['total_sqft']=df4['total_sqft'].apply(convert_sqft_to_num)
#print(df4.head())

#print(df4.loc[30])

df5=df4.copy()
df5['price_per_sqft']=df5['price']*100000/df5['total_sqft']

#print(df5.head())

#print(len(df5.location.unique()))

# First split
df5['location'] = df5['location'].apply(lambda x: x.strip())

# Then explode to create separate rows for each word
df5 = df5.explode('location')

# Now group and count
# Group by the full location name (as is)
location_stats = df5.groupby('location')['location'].count().sort_values(ascending=False)
#print(location_stats)


len(location_stats[location_stats<=10])

location_stats_less_than_10 =location_stats[location_stats<=10]


#print(location_stats_less_than_10)
#print(len(df5.location.unique()))

df5.location = df5.location.apply(lambda x: 'other' if x in location_stats_less_than_10 else x)
#print(len(df5.location.unique()))

#removing outliers
s=df5[df5.total_sqft/df5.bhk<300].head()
#print(s)

df6=df5[~(df5.total_sqft/df5.bhk<300)]
#print(df6.shape)

df6.price_per_sqft.describe()#describe price_per_sqft column

def remove_outliers(df):
    df_out=pd.DataFrame()
    for key , subof in df.groupby("location"):
        n=np.mean(subof.price_per_sqft)#calculating mean
        st=np.std(subof.price_per_sqft)#calculating S.D
        reduce_df=subof[(subof.price_per_sqft>(n-st)) & (subof.price_per_sqft<=(n+st))]
        df_out=pd.concat([df_out,reduce_df],ignore_index=True)
    return df_out

df7=remove_outliers(df6)
#print(df7.shape)

def plot_scatter_chart(df,location):
    bhk2=df[(df.location==location)& (df.bhk==2)]
    bhk3=df[(df.location==location)& (df.bhk==3)]
    matplotlib.rcParams["figure.figsize"] == (15,10)
    plt.scatter(bhk2.total_sqft,bhk2.price,color="blue",label="2 bhk", s=50)
    plt.scatter(bhk3.total_sqft,bhk3.price,marker="+",color="green",label="3 bhk" ,s=50)
    plt.xlabel("Total Square Feet Area")
    plt.ylabel("Total per Square Feet")
    plt.title(location)
    plt.legend()
    plt.show()

#plot_scatter_chart(df7,"Rajaji Nagar")

def reduce_bhk_outliers(df):
    exclude_indices=np.array([])
    for location, location_df in df.groupby("location"):
        bhk_stats={}
        for bhk,bhk_df in location_df.groupby("bhk"):
            bhk_stats[bhk]={
                "mean":np.mean(bhk_df.price_per_sqft),
                "std":np.std(bhk_df.price_per_sqft),
                "count":bhk_df.shape[0]

            }
        for bhk,bhk_df in location_df.groupby("bhk"):
            stats=bhk_stats.get(bhk-1)
            if stats and stats["count"]>5:
                exclude_indices=np.append(exclude_indices,bhk_df[bhk_df.price_per_sqft<(stats["mean"])].index.values)
    return df.drop(exclude_indices,axis="index")

df8=reduce_bhk_outliers(df7)
print(df8.shape)

#plot_scatter_chart(df8,"Hebbal")

matplotlib.rcParams["figure.figsize"] = (20,10)
plt.hist(df8.price_per_sqft,rwidth=0.8)
plt.xlabel("Price per square feet")
plt.ylabel("count")
#plt.show()

#print(df8.bath.unique())

plt.hist(df8.bath,rwidth=0.8)
plt.xlabel("bathrooms")
plt.ylabel("count")
#plt.show()

#print(df8[df8.bath > df8.bhk+2])

df9=df8[df8.bath < df8.bhk+2]
#df9.shape

df10=df9.drop(["size","price_per_sqft"],axis="columns")
#print(df10.head())

dummies=pd.get_dummies(df10.location)#making dummy number foe text 
#print(dummies.head())

df11=pd.concat([df10,dummies.drop("other",axis="columns")],axis="columns")
#print(df11.head())

df12=df11.drop("location",axis="columns")
#print(df12.head())
#df12.shape

#traing and testing model
x=df12.drop("price",axis="columns")
#print(x.head())

y=df12.price
from sklearn.model_selection import train_test_split
x_train , x_test ,y_train,y_test =train_test_split(x,y,test_size=0.2,random_state=10)

from sklearn.linear_model import LinearRegression
lr_clf=LinearRegression()
lr_clf.fit(x_train,y_train)
#print(lr_clf.score(x_test,y_test))#print test score

from sklearn.model_selection import ShuffleSplit
from sklearn.model_selection import cross_val_score

cv=ShuffleSplit(n_splits=5,test_size=0.2,random_state=0)

#print(cross_val_score(LinearRegression(),x,y,cv=cv))
from sklearn.pipeline import Pipeline
from sklearn.model_selection import GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import Lasso
from sklearn.tree import DecisionTreeRegressor

def find_best_model(x, y):
    algos = {
        "linear_regression": {
            "model": Pipeline([
                ('scaler', StandardScaler()),
                ('lr', LinearRegression())
            ]),
            "params": {
                "lr__fit_intercept": [True, False],
                "lr__positive": [True, False]
            }
        },
        "lasso": {
            "model": Lasso(),
            "params": {
                "alpha": [1, 2],
                "selection": ["random", "cyclic"]
            }
        },
        "decision_tree": {
            "model": DecisionTreeRegressor(),
            "params": {
                "criterion": ["squared_error", "friedman_mse"],  # note 'mse' is deprecated
                "splitter": ["best", "random"]
            }
        }
    }

    scores = []
    cv = ShuffleSplit(n_splits=5, test_size=0.2, random_state=0)

    for algo_name, config in algos.items():
        gs = GridSearchCV(config["model"], config["params"], cv=cv, return_train_score=False)
        gs.fit(x, y)
        scores.append({
            "model": algo_name,
            "best_score": gs.best_score_,
            "best_params": gs.best_params_
        })

    return pd.DataFrame(scores, columns=["model", "best_score", "best_params"])

mn=find_best_model(x, y)
print(mn)

columns = np.array(x.columns) 

def predict_price(location, sqft, bath, bhk, columns, model):
    x = np.zeros(len(columns))  # Create zero vector of length = number of features

    # Set the numeric features
    x[0] = sqft
    x[1] = bath
    x[2] = bhk

    # Find location index and set 1 for that location column
    if location in columns:
        loc_index = np.where(columns == location)[0][0]
        x[loc_index] = 1

    return model.predict([x])[0]
P_prices=predict_price("1st Phase JP Nagar",1000,3,3,columns, lr_clf)

print(P_prices)

import pickle
with open("bangaluru_home_price_model.pickel","wb") as f:
    pickle.dump(lr_clf,f)

import json
columns={
    "data_columns":[col.lower() for col in x.columns]
}
with open("columns.json","w") as f:
    f.write(json.dumps(columns))





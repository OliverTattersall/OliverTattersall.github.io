from bs4 import BeautifulSoup
import requests
department = "MATH"
url = "https://ucalendar.uwaterloo.ca/2021/COURSE/course-"+department+".html"
r = requests.get(url) 
html_doc = r.text 
soup = BeautifulSoup(html_doc, 'html.parser') 
classes = soup.find_all('center')
# print(soup.center.find_all('class'))
# class1 = BeautifulSoup(classes[0], 'html.parser')
# print(classes[0].div.contents)


class course:
    def __init__(self, title, Prereqs, Antireqs,  level) -> None:
        self.title = title
        self.prereqs = Prereqs
        self.antireqs = Antireqs

        self.level = level

        

count = 0
betterdata = []
lengths= set()
for i in classes:
    courseinfo = i.div.contents

        # print(courseinfo)
    # for k in range(len(courseinfo)):
    j = 0
    while j<len(courseinfo):
        if courseinfo[j].string==" ":
            courseinfo.pop(j)
        else:
            j+=1

            
    if count==0:
        print(courseinfo[0].contents[0].contents[1])
    title = courseinfo[0].contents[0].a['name']

        # print(len(courseinfo))
    count+=1
    # if  len(courseinfo)==10:
    #     print(courseinfo)
    
    lengths.add(len(courseinfo))

print(lengths)


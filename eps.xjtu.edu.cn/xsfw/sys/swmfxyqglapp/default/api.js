define(function() {
    return {
    	//现场登记
    	getxcjcTjInfo: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/xcjc/getxcjcTjInfo.do',
    	getPcXsxx: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/xcjc/getPcXsxx.do',
    	getryxxInfo: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/xcjc/getryxxInfo.do',
    	getwcryxxInfo: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/xcjc/getwcryxxInfo.do',
    	getjcryInfo: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/xcjc/getjcryInfo.do',
    	getxcdjInfo: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/xcjc/getxcdjInfo.do',
    	getwcxcdjInfo: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/xcjc/getwcxcdjInfo.do',
    	saveXcdjInfo: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/xcjc/saveXcdjInfo.do',
    	saveMrgldd: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/xcjc/saveMrgldd.do',
    	savewcXcdjInfo: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/xcjc/savewcXcdjInfo.do',
    	getXcjcJxryInfo: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/xcjc/getXcjcJxryInfo.do',
    	getXcjcSsxsInfo: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/xcjc/getXcjcSsxsInfo.do',
    	getXcjcJcryCdxx: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/xcjc/getXcjcJcryCdxx.do',
    	//上传照片
    	UploadImg:function(zptoken,type,callback){
    		var self = this;
    		toongine.media.chooseImage({
    		    params : {"count":"1"},
    		    callback: function(res) {
    		        if (res.code !== 0) {
    		    	    mintUI.Toast(res.msg);
  			            return
    		        }
    		      	$.ajax({
						type : "post",
						url : WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/fxupload/uploadZp.do',
						dataType : "json",
						data : {
							img : res.data[0].base64,
//							img:"/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCADcANwDASIAAhEBAxEB/8QAHAAAAgMBAQEBAAAAAAAAAAAAAAYEBQcDAgEI/8QARhAAAQMDAgQDBgMFBQYFBQAAAQIDBAAFERIhBjFBURNhcQciMoGRoRRCsRUjUsHRYnKCkqIWJDNDU+ElNNLw8WNzg7LC/8QAGgEAAgMBAQAAAAAAAAAAAAAAAAQCAwUBBv/EADERAAICAQMCAwYGAwEBAAAAAAECAAMRBBIhMUETUXEFIjJhofAUI4GRsdEkQsHx4f/aAAwDAQACEQMRAD8A3+iiiiEKKKKIQoooohCiiiiEKKKKIQoooohCioMy8W63nEudHZV/CtwBX051DHFtjUdpwPn4a8fXFdwZEuo4Jl1mvgUDuDn0qilXSLc3G40G5tEupWnDSxqCsZGeuOdFknEspS4kIIV4bqf4HP6K/Wpisld0WOrUW+Hjjz+/WX1FfM19quNwoooohCiiiiEKKKKIQoooohCiiiiEKKKKIQoooohCiiiiEK8uOJabUtaglKRkqJwAK9HlSpxFJQ4+006pRjpeGtIO2lIyon5kDftU0Te2JRqLxSm6XLV9t7kjwS/4ayfc8VJQF+hPOpsiSzFYU/IdQ00gZUtatIHzNZdcLhJVGkT5CHXYri/d0oASonkkLUAFf4Un161VqunjNtMqgtOpR8KJLzjwT9SB9qZq0bW/BEB7RZMi1fT0jtP9osJtRRbIjs0j/mk+G38idz9Kr03y7XlgvT5LcGDnAahkhx3y1ncD0xVC5d4jaQZtqiLaJCSWElKxnbbvUy4sNxmoz0Z1S4rqf3erfTtkD0xTq6OtcKwOYtZq73BYHj5Sa3Piw8iFDZazzVpyo+pO5r3+3JJPx1QteNJUUx2nHiOegbD1PIVMTbZWMuvxGD2W7k/amTVUnBiW25+QTLVN21rS4tptTqTlC9I1JPrVu8+2zOYuIGYc9AS8Oyu/r/Q0olltskG7QCodAo1Ys3IIs0i3rdiPlatTJS/jSr5gVRZUmQV9D6f/ACX0ixch/Ueo/vkS/XbpHjuiTdJ61aipBQ8UJCemAKksu3OGkBuSmWgfkkjCv86R+opdtVzllhJnag5HGFAnILfcd8fyplQtK0BaFBSVDIIOQRSL0hTtMYrvY+8pI9ZJYvsZSw1KSuG6dgHsBKj5LGx/WrQHNUTiEOoKFpStCtilQyD8qiNIlW05tzoLI5xXlEo/wnmn7jyqlqfKPV6w9HEaaKrbfeo81zwFhUeWBksO7KI7pPJQ8xVlmqSCODHVYMMqYUUUVyShRRRRCFFFFEIUUUUQhRRRRCFFFcn324zK3nlhDaBlSj0FEOk5Tnn2mD+HQCog5Wo4SgY5nv6UgXl0ITPYLpXJEVCAkjUfFcOVK0+SaZZbtwuaGyoqhwnXEtpbGzjoPMqP5RjOwpLej/t5tcKKooC5a1uvcy0wnKUp81KOTv2z2pvTpwSZlapvEcAdvv8AqVDdnu10muPqK3lJASFyJIUoeeMnT6YG1Xlv4TU2kqmSAFn8rW/3NXluiQbcwIUBlDbbWxCR18z1NS81oDUuq7F4EXGnQnc3MopHCsF5LY1vApWF519t+1TVWlh2LHjvalMs8k6sZPmampVl9aeiQPvmvdVtY56mWitR0E8NtNNoDbaEJQnklIGB8q9aE/wJ+lBQlYwpINcVIWwdQWstnnvkp/qKh1kv0ka4WpuW0ShlguDlrGn/AFJ3FJV1LsJp9K48hXhYUtskeKzvssHktGfzDcdRWjJKk41gFJ5KHKvE61tXBtOsAOIyW3MbpyMEeYI2I6iui5kk/BVuoiHbL2xOjtSA94EqOoJlRyNPiN/9VA6kdcVYJlzrBIcjx3QpCd0tq3QodMdvlSVxDETZLo/BWnZBCm8/wnkQft8q7228OTC02+5qW2jSlR5lI6fLan004YA9VMzdQcZxwRNSh8QsvJYTLbMZT6QppZOW3R/ZV3HIg4Iq1J2qg4KEa62242Wa0l1ltYeQlXRK85x2woHcd6i3M3Xgt0FzVNtClYQ4o+83nkknoex5HyNZYX8w1HqPrG8HwxaOVP0jBKjtS0BDqc6TlKgcKQe4PMGvsa/vWopZu6i5FzhE4J+HydA5f3ht3xUSBdYt1i+PDdCwNlJOyknsR0qQFpcBQsDfYg8jXWrzwwlldhQ7lMakrStIUkgpIyCDkEV6pKhynuGnMJCnbOTlTY3VF8090d09OnanFl5t9pDrS0rbWApKknIIPUGkrKyh+U0arRYPnOlFFFVy2FFFFEIUUUUQhRRRRCFR32GpC2y6NQbVqCTyKuhPfFdVr09qhSHdWnw1Jznff4fWugThwesquK5E6JHZmRI4daYS4tw6wNBKcA4JGeZpXeWnhPhVCE4Mx0hIJ/M6rmT6fyFNF7fLsSPGWggPSGkqz66yP9NZvxjNVN4jSwFfuojrTWP7alBSv/5FO6QE8Hp1id6DdnvHa2RyzDTqySRuTzPnUzFdkM4ShA6CuqI+VK9am1mTmVrXgYlagj8e6jO/hpV9yKkhBNfERAi9KcJ2UjRj71apjoFcewDEEXOYtPuyYc4agXI7nTG6T5VbttpXpBwUrHunvXeZHbU3yGeYPnVULin8M6gApU2PFR8uYoL7gMcGcCspOORLRmMGcoPIcq8uFLfujl0qouHETbUeHIbIUJAOBnBOOeM9aIl2auKMJV73LB2IPYjoa4K2I3GSNgB294p+0izquVsMtpH++QgXEkDd1r8yfUc6ymHLW26haVYKTlJzX6BntqfgOFABdQkrQO6h0+fL51m3D/A0q/qlu22TDaitLBbS9qKtKhqTyHnj5GtPSahK0K2HAi91TWfAMmM3s+nJVxLGWg+5KiuII8xhQ/Q1qkqMzMjORpDSHWXUlK0LGQoHoayHhu03Cw8d22NOaShRdUAps6kKHhq5H+R3rZKyteytduU9Y17PUrTsbsTMR4ls8/gG9NTLe8swX1aWVr3wefhOd9tweZ9Ru0Wa9x+IYBeYHhyW9nmSclJ/mD0NOl+ssbiCzSbbLH7t5OAoc0KG6VDzBwa/PjD1x4U4icbd92ZDcLTyRslxPP8AyqGCPUdqf0jfi0Kn41+oi2pqFByPhP0M15iaArw3Tjpk11hS/wDZ11RyTaXFZWkb/hlHmof2D1HTn3qs8di525u5wzltYyodR3z5ivsOe0pSoriwVadgfzDtVb0hlPHqJUlzVsOfSaEhSVoCkkFJGQQcgivVJthuibVJatb6j+DeOIjh/wCWr/pE9v4fp2pyrLtrNbYM2KrBYuRCiiiq5ZCiiiiEKKKKITi6nKTnlVWvShxbaVcyB72Bz5juRVutORUQRUhZXpBUBzIqQnIvXtxLRtyykBJnIyB+UFKgN+oO1Y+mUq4PLlKO783x8+XijH2xWge0q5/sS3W9lr3nHpaXAOZS217yv1A+dZtD/c2lTg5NMoV/qTWz7Pp3Vux8jM/VvtdQPOba1MCrjJZ/6aUkfPNd/wAYlp1es4GjXn050nC7tt8Uy8LGG1pQ4OyVJBB/99qvLs+I0BUzTrDHvrSPzI5KH0/SqXp5HzkVtzkeUj3u6qiXWKUn4nU4PQ5Bq7bu7TqGlBWA4NvI9az25lxcUMOKUpEdaFxpCT8bWcgf3gAR8jTJOtsZNv8ADt90aMlJ8RorWD72Nts7gjYjt6UvaVR1DdCPrGqqi1TFfiB+hl/MfUYyyOYGaTfxZRdnGidvESof3F+6fuTVhaL+3LQuFNT4ExtOHG1Hl0yD1T5/Wlu8vOxZMaQy0XFFXgKSPMgpP1H3rrJmskdsGFTbLcN3BE8XW6WuBZG13ZBeDaVhloYJUtS8/YDn50k2nim6P31pq0xVqK1fu2C4Vq23xqPTbkftTr7SOFyxwm1IaaBLJaQVdcnOpX2ArK4VrkpcC9RbIONvi/7VZoK/FBsHp9ic11y14Q48/wB5v9mvjFwlPxwpOtJSsIzuApIUAfqa88GwnLXPkNMH9062sgdP3by0kf6h9ay9iROs8mHdgoH8E41BWlIwFNYzg9zk863HhlLLtuVIbIWoSJAGD0LhJH2Fcvyi4IkKArHKniRbwGZQSvxFtv8AxNrxnS4ndKge2eflmmS2TRcbZGlgY8ZsLI7HqPrmlhbzt2mLbWdLTGdK1pGcjcjbbbB+YHarjhVOnh2NzxqcIzzA1qxS9y4UZ6yOmcm1sdDLqsl9sNg0GLxHHRsnEaZj+En92s+hOn/EO1am+94Sc4Jx2qqu8Vi/WebaZI/dy2lNZ7ZGx+RwflUdPa1NosXtG7axYhQ95jPBV+/Zlx/ByFf7nJOk55IV0P8AI043CL+DmJWkYGdSFdvKsj0PR3HI0kaZLC1NOp7LSdJ+4rU7Fcf2/wAKZWrVKie4vPM45H5j9K9NqkGRevQ9Z58KSDWeolsEN3KEtpxOG3hvjbSR27YO4pl4Yur0yO5BnKBuEQhLh/6qT8Lg9Rz8waTbTIwXI5OyveT6j/tU12aYEiPeGtzEVokpH5mFHf6bH5VlaineCn7ff0jmlu2kGaJRXlCkrQFJIKSMgjqK9VjzYhRRRRCFFFFEJ5UoAb14CweVcZLi0ck5BODSfxlxC9YLCsRnB+OlEtR88wSN1+iRk+uB1qaIXIUdTIswUZMQeNrsm/cYSnG8KiQUmGyQchRBy4r/ADe7/hqnLIRw/cANklKGQfU/9qjQWyhkIydI2Tnr556nrVhPAZ4XRvvIlZHmEp/qa9lVSKalq+/Mzz1tpssLyujz5MjiWRcmzqbbtqZEtvqpCAhCyPNJyfMA1pPD94YuMc22QtLgcaJYXnZ9ojp5j9MGkr2d2lN14oukTH/Hsr7RJ6a1JSKnX+yJhfsZ22P/AIVE3S69HyUmO6jZamyOWVZBT3+dY9x23NQe3SaCoGrFo/WRLlLkNzGeEgh4S/fQX0HBSke8he/MEAE+nes1dUpNwK3Fa069WpCsBQz0PT+Va6uapPElpeucRb81CVIRKYRu+0R7yVJHJYHvDGx35VR3TgBcG6ulnQ606srjrOyVoJyD6/pVFABsNTdZZqb9tYu7ecZ+DTa+MIbzaWn40iKcta3tbiUcgtK8DJ6EEY5V2vUKdaGx+MQFhtaXGpLY9xZSQQFD8pOOu3Y1K4Cski2y0OaQoBKg4tJ90Z6Z69KfX4jUggugqA/L0NZ+rf8ADXFKzkEciMaJhq6hY4wQeDI62Yt7spZWAuNJaG47HcEemxpIPBP4d464bKyg+6+Ve6fPHP5Yp1FxtsNSIzbjadwkIaTsM+mwqY82HEEeVKafW20ArWesZ1Xs+nUspuB4/SZjbrH+0+Hn28JWt55bgKuRUFZH6Cqr2d8bixPPRLioqiyHSvVn/hu594fWmzgmSHLW8yfjZd0keWP/AJpcsHsomXy3uXSTc0QTIWSywhgOJLYJwpe49489un2299eCLuhmcqMD+VxiPFw4qtz/AIcS0JQ7NlqDbadOnUo5xnyG5J7Zpvt0MQLdHiJVqDLYRq7kDc/M0scI+z+3cKOKkh1UucpOkPLQEBCeoSkcs9TkmmpToBAzzrPuKE4TpGKkYHc/UzxKZLg5kDntUZiM4FJUTg8iKnhYIHnXsYPKqsy+fnn2n2v9m8fynEDSiayiWOxV8C/ukH51y4Buv4TiMMOY8GYnwldtXNP9PnTl7a4CVfsG4afhecjrPcKTqA+qPvWYRv3MhLqMpW2oKQc9RvXrfZx/EaLYfmP6mFrSKr8/rNMLqYN0IJx4TmSP7OanIwi7qZWnLT4U2Uk/Fn+VUd3YU/PMppZSmQlDgA3+JI+lS3pLqQydWFBKVbbb0uUyAfMRcNtJ9Y/8GyXHbH+FeVqeguqiqJ5kJ+E/5SKYaS+EZH/jtxaAViQw1I3HUEpJ/SnSsHVLttP7/vN/TturBhRRRS8uhRRUS53OHZ7e7OnyEMR2hlS1foO5PQDc0Qke7yItvgPTZshMeMwnW44o7AD/AN8utYTerrKv90XdH23GUEFuMyrYtNZ6/wBo8z6AdKaLxcpnFMtMuchbFvaVqiQVdD0ccHVfYck+u9VSYbsi4JQls6R8KT271veztMKj4lnWY+t1W/8ALTpKhq3yJLYdK8NoTvpHKjiFAiIgWzOVR2dbm+ffWcn7Ypsg2pMV9EdYT4KR48hwjYAb4z5n9DSDcppuV5lyznDzhKfIch9gK2KbDbZ8h9/3M9htXmPfsaia7/epfRqMyz81KUo/oKk+0e0Ow7/bpzIX+FkPDI/KhzJKsdtWx9Umrr2Q2lULhZ6e4MLuEhTo/uJ9xP6E/OmziO1C9WGVC1JStSdTazyStJ1JP1ArzN2p/wAxrB0zN1Kc6cJ3xMi4jkLTwrabxCWA6h1t5Ch0KTuP1Hzpzh3GNd4TMtPhOxHkhxBVgp3/AJ1nURyW7YptnXFKlx5qVxkrSNKgtWdG+xwcEdCM1pFmk2ONclSDAbtplR0vqacbKAh1Kil0aTsCDpyQNwQetVa2reQ3eX6DUCpWQjIlzGlR20JBWEJxt7pA/TFdZjKblCW0zJ06se82rPyOOlWjL7UloOMOocbPJSFZFcJUKO4grMdBWOqRpV9RvWd4A6RvxTncIuxbB+FfS/Kfb8Ns6ttht3zVZxBxPJlMrh8PMmW7nSt1OCB30jI1kdhz71x4pgmax4bb8ouLUlDTa3SRrJAG3XzznbNe2+B7vBfZkN3iPobH7wIYKT6pyrHyNWUaOtc7zj/sLtZY5DLyf4kSy2piyWhy8Q5S5LS3ltvurQW1qzjGtB+FSHAU47KFOnCrU+BAVb58fQWlamnEboUhW+B2IJIwemKWbPLhQOMP2WX5jyblrVITN0hK3wElJSgAAe6k7jY4HrWijlTdrnaEI++0SRQWLgyO87oBO+B2qA66HwFALSkZJOOfp/SrF1Iwe5qr1J8ZYQ2UgKCvcTnAG5OTyqgS2d0KdWtICgRnSSkbbczmrBs7CqptKpAwFgkYUVHO5Pbt6VZMghI1HJoMBEv2txi/wYlwDJYmsObdBq0n7KrJUw0sk7HJ3wa2/j9pL3BNwSoZx4ah6haSKy2JDbdKXFq1k5BBGRXovY1uyls+c8/7YVmsUL5SWl0uW2IohWQyEEg4OxIro2VFgLcBJLY2znBya9BrwY7SADgDGe+9cVSkpSsHfSNwKYPPSLDIHMceE3FuX9hajnVbDnbs4Mfzp7pM4UbK7/JcAwmPBZZx2UolR+wFOlee1p/N/aeh0gxUIUUUGlIzOEyYxAiOypLiW2Gkla1q5ACsxuD0jiS4ouE9KkR2zmDCV+T/AOoodVn7DamO+PG93L8KDmBDX746OvDoe4T+vpUd2MkrwEAkj3j5dq0tNWqe83X+Jmaq8sdi9JR+AoSi2kpWQNyd0p/qamx2VR85RqdXyB+JR/kKsEx2o6w0lIPXSkfrXCSWrPHcmyHSpZ257qPQDypw2bvdESwFGT2i9xhcBa7V+z21BUqXu8R0T2+fL60mWixSLtOjw2BhyQrQD/CPzH5DerO4lc+W5Mkn3ick9AO1aZwBw0q2QjcZbWiVIThtChu03zwfM8z8hTWouGj020fEfv6SnSf5d/HwiNsGGzb4LEOOnSyw2ltA7ADArg9HjyHXGZA1KWMj3iDp8sVJQ6pzXpIGlRTgiqWct+PPRIeJwn4VgHSB1Hl8680oJOJ6C1wq5I4mccV242a7uNhya+6tSHCouDSplPwJxz1JIIB/qa+328O8XXiLKQPw9vjK8FDbm63ApSdZWAfd2AwPrzp84tsDV/tIkxwPxrCdbDiTuRzKfQ/rWRXsSocMyUJWw+D4UltPMkHmPOtLTquoTH+wmba9mntx/q2P/JtUmGyEqdRqYcQNnWjoUAPsR65pSe4/uNreuTD8Bud+C0qCmlFta2zyVpwQe23ascN8kuOKdU7LKlZyv8QrUc/OtQ9mtrlX6JLvdyypt1H4VhSk6fFQCdSiOvbPrSb6TwDksGE1lv8AFUjaQZOtnHNqncVwlzPw0UOMrDSg5kBZxuokAA4yPnWhSC54WW9GnGST2rP717OYAgPyIDTTEhoKd0qOUrTjdBHQYG3Y1nNlvF8t8tDMSe83HcaKlMKdUUNIPI4JxnpjrTVejF43Unp2MUs1RpO20de8v/aI5HlToUoLacDTpbBWSNCCcE7bgA7gjfapvDvtDn2SWqBOf/a0Nk4UUOBx9pP8SVDZ5H+r9KW21SZSHX4EYKaQrSuW/wAirsO58hVP4pk3eIbjL0sIfSHHI+Q4hOdyk4xtz8wDT12mpCbWbkdorRbcTkLwfvpP0pAuMK8wG5tvktyIzgylxs5HmPI+R3FdvBABwMelZBCXd+BeJFJCfEDuFutN7NzmuXioH5XBtt8jkEGtghS2LhDZlxnAtl1IUhQ6isS2vZyDkHpNNLN3B6ieGo4bUSkYzUoCjFfapzLIr+0BY/2Mmp8TSVKaSD/+RNIbbTUaMpWNCAArTz27nFX/ABKX3p7zDjQbDi0qWkK1cvhV5bVUvW9TEfUPdWonWemOlbuiUV1YJ6nMwtY/iWZx0kJxZwVJ3B3GKjMsOSLm03oAQojXnkQN8mpqWlKBwCcdq6It77i0stgqVI545hHX54yKd3hRE1BJEeuCWFG2SLitOFT3y6j/AO2PdR9hn50zVHgpCITCAz4IS2kBvOdIA2FSK8za+9y09NWu1AIVWXu4mDb3CyQZS8IZT/aUcA+g5/KrOqO5R1vTGyohYbysbYxnYfzoqALjdIXsyodvWV8SGmNHbZRkhI+I81HqT6nJqR4eDyGa6IGNjnzrsvGhOyflThc5mZgASvfDEZC5LqtKUjJNIl1lPXScp1z3W2xhCTySO/rV1fp5lvllCv3LZxt1PerLh7hIurTMubeG/ibjq6+avLyp+pk0yeLZ1PSZLmzW2+DT0HUyDwnwmZjzVznoxFbIUwyof8Q9FEdh0HWn6dPi2yG5LmvoYjtDK3FnAH/fyr7LlR7fDdlSHEtMMoKlKPIAVkl4u0q/zhKmAoZQrMaKeTQ/iV3We/TkOpOaTZrLdzdP4m8i1aCkIvJ/mW0njaZKuol26OYsRIxh8e/I7FSfyDt+bvjlU6z+1aw3J1LMoOwFkbqewW89tQ/mKVbfCuF4c02uIuQAcF4nQyk+azz9Bk0p8WcKXHhS4gywlUd862pDQPh6juUb8iD35imhptO58PPvY4la36hQbCOJugvtvaKI0F1t/UrILSsobSd8kjb0FZjx1MakTbgtkghUhKU46qASD96VInEc+KwhpuQlpCRgEJyQPKoKrstyawsJ1MsOBzSo/GQc7/OmdNpfw7GxvL94tbc+oITHGf2n27W0xJy9CMNPElOB8KuorbfZjNkP8GxIMxOiVDaQnb87S06m1j1SceqTWXeO3xFOabjKSHHHcpaXsorOwSO+5+lbJwxwlC4Xj+HEW8tZQlLjjqysqASABk9BjYdM0hrCNoB6zW0+ZTcXcOFm03S7ftB0rbjuL0q67HbOaxOVKVGXJbUShxxwIGeqcADHlzrava/LTG9nspJedaU8802nw/ze9kg+WAfpWLQloesqh+8fYBKVLcHIk8q0PZTsyNk89vv9Zn+0VVHVgMjv9/pHKyXVUu1pt+EIi6Q222BgIUNwfXPM9c0t3VZgTVIDQWl868KVgDbChn6bede7AlyAwypxwrZlAKQtX5XBsUn1xt6Va8T2/wDeOE6ApolQ1jbChn+YqixM5EYRu80GDb18Y+y62OIUn9pRmsx3T0dbyjBPZQGD656VccIyFJjRVlKkR7gz+ISg/wDLeGzqfmfe9dVQ/ZOlY4CjFzHvPvEEDAI8Q8vvVtBb08PIdQPeYeceRjsHFZH0yKzHJBKdsxk9nHXEYqK8pUFJCknIIyDVbeZMmOhoxwoZVhSsDHbG/Xf7VUqljiWO4RdxlTc2XDNecW0lSlEhI1Z26enpVA/FceJSlvkdgDn5VbyQ/grW6SQRkqOSRUZp1LBSFpKQlerSRuqtaolV4mJc6s3PE5QrT4fvKKkrB2I6+VXcGxxn3HVOadBQE6EbEHOc5qZb2o8xDp0qylWNWMA+h61aMsJZTgczzVjc0pdqWOR3j2n0ygA9RPaEhCEpGcAYGTXqiikpoT4oZSQOoqv8Itai6SSRgHNWCwSg6djjaoStTTQDm6ifWppKbsYyZEcQAnIB35VAuDhbhOAL0KUCAocwOtWjuCrc864/gWpUhpLisge8U9xTKOBy0yrq2fKp1PEreHLAAEz5idSydTTahy/tHz7U1gUAYFfaouta1tzTS0ulr01YrT/2JXHssllmFqw2nD7uTscHCQfLIUf8Iqr4Y4R/bCEXK6pUmCoamIpyC8OinP7J6J68z2qx4it/7V4iaiOgeA5Ijtu5OMthLiyPngj507pASAAMAdqs8UpWEXvOCkPabG7dJ5aZbYaS002lttAwlCAAEjsAOVcJYYeYW2+0260RhSHEhQPqDUlXI1WSiA5jUdxy6UuI1Fq98FcNP2K5Ki2SC3KXFdLS0NAEK0nBHY5r87FRkRW306GR/CCefLNfqhvQH0khRzkf/NYl7UOF3LdxkbhllNuuOX8Kc0nWlI8RIH0I9cVp6C1Qxrs79PWKais4DL2lz7F7jZw9JgSI7QvAUVtSVjKnEdUgnkR2HMGtdlXKPF2JU4vWlBbZTrUCrlkDkOZye1fmFLYjTml28FLwUFtuJUcj59B1z0pzevPEk6KqK/JYZS7j8Q6wAFvY294gb7d6uv0ANuS2PvtK69X7nAkv2n8QuXyMLVEV4qozhefajr1NlKTsSce8fIbetJ0fiCIzawkJRlJSAtSQcYB/LyI35mr+BAbgRnCk6nH14KjudKf6k/aqhuy29q5Pyyy4pKHfdRsUJOAScczuflTVG1AURciL3e9hnOI68DsweJPZ+i03IIBDrgbdb+JrJKxr29zuDyP1FUKodz414vdtFvkMqZYSkPTAcIKU+74gTzOeg5Z64pSuk92DMWIDykIcbLbmk4Czzx9MfSodsvEq1zWp0V9bElo6m32+Y7gjqDyIOxqh6iCzKeT28per5ABHE/Vlst0WwWSPBjgpjRGdIKjuQBkk+Z3PzrhawGbJFbcG62tRH97c/rShw/7RInFtichL0x7uoJZUyPhc1EJK0E9MEkjmPvT+UISkDT7qdgBWOyshw45jedwyvlIMSSpFvi4UPdRpWPTb+VUU1x1cxTjis59zJ7VaoP8AuZS0kAjUM435muSLcpw+I4QFH428cx3pirahJMyrxZaiqvynxtAeSNQSRsDnvUtyxNrGUr0qUQXNsgjsO1SYsYII9wKTy36VPqp7iD7sdp0ylffGZWWq3KhJKlqIWRp0pVlOM7HHerOiiqWYscmNV1rWu1ekKKKKjJwqDLUlS9ODkVOri8yhSScAHvUlODmV2qWXAld1Ga7sFpLyVb5O3pQGda9OfnivaYxacC1KGkGrmYEROupgQcSbRXwEEZBzX2l5oRdvMFUq4+Gh3wXH2Qph3GdDzStST9FHbqAasLPdkXJlxC0+DNjkNyo5O7S/5pPMHqK63OIuVFyyQmQ0oOMqPILHfyO4PkaWpzTNycauUdx2FcWgW/FaIDjZB3bWDspOeh26jFWBdwledp5jlXBxlKiTgUnO8WXq0sLcnQok5tCTlcZZaV6lKsjHfB2G+DUTh3imQxdJar3dElhxnxveACEKyAEtjngjO2DsM8ya74LgZgLFJwI8MxQ2NONs5rLvbcy4pPDfhK0lUh1vOM80j+layy62+yh1pQU2tIUlQ5EHcGs39tLQHD1omY/8vc28nsFJUP6VLTsVtUidsAKETEYtxmWiY6QhDjZOhSD2B6HpVjGvjykOORQoIbI1oWglCSeQz0z61VTD/vT6eniK/Wtf9hEPFlvklaAUvS0t7jYhKB/6q27dUa0yw3D5zPXTK7ZHBiELyhy1IeROWM+7/wALHv8AMgKxg8+lVsd2U04/ITrLBwVguDIJ/MRk43xuR9Kefa9PQriCFZYqENxoLJfcQ2kJHiuHbYdQkH/NSpw6yy5Pfclf+VajOqe26FOnH1Ior1O6vcFx/M4aAr4Jz6ydbuB3+LJPgRLgwSqO5JRgYKVDCQHB+XKiRtnkTVGjgfiJHEMazSLa/HflO+Ghx5J8IbEk60ggjAPKth9i9mdicNyLtIRpcuLgKMjctIGlJ+Z1H6VpeBSFuvsW1sHd5ExpNOpQcY9Jl3Cvs7jcLSoKpxjy7gl9T6Hm0FHhgII0jfKhnfetMSrIBqpujiW+JLVq2BakH5gI/wC9SjcGwd+VJWFrMMesvTCZE+21Ici6uS0uOJOPJRFSUxwk5PequyzUKuVyhZ3S4H0eaFj/ANQNXlQckMZFEG0TylOK9UUVCWwoooohCiiiiEK+EZGK+0UQnBTZTvXkgqJCicVJxXkoBOalmVlPKeWgQnB5dK6UAYGKKiZMDAhVDe7S6tZnwEgyQMONZwHgOXoodD8jV9RUlYqcicZQwwZnQkszUKKdwCUOIUMKSeqVDofKkWe4mItyGy2fHaUEvOr/ADtg5SkEkbEYzvjnzJrYL9wtGvCjJYdXCuIGEymQCT5LTyWnyO/Yist4mtt3tZSq8W0K98IamRPfaWo7AEfEgnlg5Hma0aLUc4MSet05HMcfZ9xNd7uXI0lj8U0hSlOTAsBLefhbACQD8uX0pQ9unEmuTA4bjrGEES5OO+4bT/8Asr6U7+zOVF/2ReWlxIU3KeL/AE077E/4AnevznxJeV8Q8SXG7LJ/3p9S0Z6I5IH+UCq6qw15IHAjBYisfODzviuOPHAT8RyeVfo/2V2dyz8Awg+goflFUtaSNxrOUg/4QmsR9mfBr3GHEiTJCjaYSkuSieTh5pb+eN/IeYr9RBISAAAAOQFGtuz7ghSmOZhXECG5vG97lOoCymX4SdW4whCU/wBai3G3GXbWY0dKWnrlNailSRj3dQH6qz8qkyiV3i7LPNVwkH/WR/KriyRvxfEPDUc8kPuyj6JScffFMk7Kx8h/yLjmyazEitQojMVhAQyyhLaEjokDArtRRWPH4rcWr/C3KxSicI/Erjn/ABtnH3SKjPSQkYzUvj+A9O4PmKipJlRNMtgDmVNnVj5gEfOlVm6MzYbUppYLbqA4k56EZp3TgMvpFbztOYTru5ZbtEvaUlTUfLctKeamFfEcdSkgK+RrTWXm5DDbzS0rbcSFIWk5CgRkEVi9xurhStDSQorBSlJ6+vYVJ4LvXEMObGsVvcTOjRmknwHylJDYUArSrYjGrIznarNRpiRvHaQ094ztM2Oiiis6OwoooohCiiiiEKKKKIQr5vX2iiEKK+Y3r7RCFFFFEIVDulrh3i3uwpzCHmHBulYzg9CPMHeplFEJmLvClw4U9n3F6VTm3lvRFllbKSk6UtkZI6KIO+K/PcOMqbIjxmlJS4+4hpGrllRCQfQZr9lTojdwt8mG8MtSGlNLHkoEH9awSxexbiWDxRCVJchfgIkpDpfDpJcQhQUMJxkE468qe094AYseZSydAOk2rhbhuFwpYY9qhDKWxlxwj3nVn4lnzJ+gwOlXJoqvvd3jWO0yLhKVhDSchI5rV+VIHUk7Ulyx+ct6TE2XA89Lc/ilvq+riqduBonj8SyZPNEGGiOP76/eV9gPrWf2fW3FUJaFNuFZcWTyAO5rXPZ9CVH4YbmujD1xWqWvyCvgHySE1pao7a8RKld1mY1UUUVmR6fCARgjNYlf7PL4OuaoaW/Ftcpxa4CkKGWx8SmlA8gnOx7HHOturOePOHOIeIr3FEaOk29hAShxDqQsKUoalEHtpHyzTOls2WZJ4lN6b0xEB19SQCkeK4ojZIJznkABnnyHetD4A4Rm2+au93IFl1xkssRiPeQgkElXYnA93p9hK4W9njNnlpuNyf8Axk5ta1MpSMNM5OxSDvqx3OxO3enirdTq942J0lVGn2e83WFFFFIxuFFFFEIUUUUQhRRRRCFFFFEIUUUUQhRRRRCFFFFEIUUUUQhWbe1aNdNFtuMSOuTCilzx20AnQVAALIG+wyM42z51pNfDVlVnhuGxmRddy4n54hQuIOKAYtqtTyW3AUrkOgobSDzyogfQZNb9bYhgWuJDKgrwGUNagMZ0pAz9qk19qy/UG7HGAJCqoV98wooopeWwoooohCiiiiEKKKKIQoooohCiiiiE/9k=",
							tokenId : zptoken,
							type : type,//1学生照片
							fileName : self.getRadomNum()+ (res.data[0].imageType.indexOf(".")>-1?res.data[0].imageType:("."+res.data[0].imageType))
//							fileName : self.getRadomNum()+".jpg"
						},
						async : false, // 默认为true 异步
						success : function(result) {
							if (result.code == '0') {
								callback(result);
							}
						}
					});
    		    }
    		});
		},
		
		//删除照片
		delUploadImg:function(tokenwid,callback){
			mintUI.MessageBox.confirm("确认删除该图片？",'提示').then(function(){
//				MOB_UTIL.doPost({url: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/fxupload/delUploadZp.do',params: {}}).done(function(result) {
//                });
				var delArr = [];
				delArr[0] = tokenwid;
				delArr[1] = tokenwid+"_1";
				delArr[2] = tokenwid+"_2";
				for(var i=0;i<delArr.length;i++){
					$.ajax({
						type: "post",
						url: WIS_CONFIG.ROOT_PATH + "/sys/emapcomponent/file/deleteFileByWid/" + delArr[i] + ".do" ,
						dataType: "json",
						async: false, // 默认为true 异步
						success: function(res) {
						}
					});
				}
				callback();
			},function(){});
		},
		getXcjcImageArraySrc : function(token) {
    		var fileArray = [];
    		var fileUrl = "";
    		var fileWid = "";
    		if(!token){
    			return fileArray;
    		}
    		$.ajax({
    			type: "post",
    			url: contextPath + "/sys/emapcomponent/file/getUploadedAttachment/" + token + ".do",
    			dataType: "json",
    			async: false, // 默认为true 异步
    			success: function(res) {
    				if (res.success) {
    					$(res.items).each(function() {
    						fileUrl = this.fileUrl;
    						fileWid = this.id;
    						fileArray.push({"fileUrl":fileUrl,"isImage":this.isImage,"fileWid":fileWid});
    					});
    				}
    			}
    		});
    		return fileArray;
    	},
    	getRadomNum : function(){
			var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
			var nums="";
			for(var i=0;i<32;i++){
				var id = parseInt(Math.random()*61);
				nums+=chars[id];
			}
			return nums;
		},
    	getXcjcImageSrc : function(token,xbdm) {
    		var fileUrl = '';
    		if(!token){
    			if(xbdm == '2'){
    				fileUrl = "../public/images/man.png";
    			}else{
    				fileUrl = "../public/images/woman.png";
    			}
    		}
    		$.ajax({
    			type: "post",
    			url: contextPath + "/sys/emapcomponent/file/getUploadedAttachment/" + token + ".do",
    			dataType: "json",
    			async: false, // 默认为true 异步
    			success: function(res) {
    				if (res.success) {
    					$(res.items).each(function() {
    						fileUrl = this.fileUrl;
    					});
    				}
    			}
    		});
    		return fileUrl;
    	},
    	
    	queryIsRetunSchoolPeople: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsq/queryIsRetunSchoolPeople.do',
    	saveRetunSchoolApply: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsq/saveRetunSchoolApply.do',
    	delayEnterSchool: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsq/delayEnterSchool.do',
    	saveReadNotice: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsq/saveReadNotice.do',
    	reapplyEnterSchool: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsq/reapplyEnterSchool.do',
    	queryDict: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsq/queryDict.do',
    	queryShlcInfo: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsq/queryShlcInfo.do',
    	querySettingInfo: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsq/querySettingInfo.do',
    	hasReadCommit: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsq/hasReadCommit.do',
    	queryTravel: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsq/queryTravel.do',
    	queryApplyInfo: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsq/queryApplyInfo.do',
    	saveTravelOtherInfo: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsq/saveTravelOtherInfo.do',
    	queryMrqkInfo: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsq/queryMrqkInfo.do',
    	saveMrqkInfo: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsq/saveMrqkInfo.do',
    	saveReturnTrip: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsq/saveReturnTrip.do',
    	sendVerificationCode: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsq/sendVerificationCode.do',
    	uploadZp: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/fxupload/uploadZp.do',
    	delUploadZp: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/fxupload/delUploadZp.do',
    	queryTravelBasicInfo: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsq/queryTravelBasicInfo.do',
    	saveHealthRecord: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsq/saveHealthRecord.do',
    	saveReturnSupplement: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsq/saveReturnSupplement.do',
    	refreshCode: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsq/refreshCode.do',
    	queryFxsqInfo: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsq/queryFxsqInfo.do',
    	queryJkdaInfo: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsq/queryJkdaInfo.do',
    	queryFxxcInfo: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsq/queryFxxcInfo.do',
    	queryFdyInfo: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsq/queryFdyInfo.do',
    	
    	getStaffInfo: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/generalStaffReturn/getStaffInfo.do',
    	saveEditPhoto: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/generalStaffReturn/saveEditPhoto.do',

    	getCurrentStateInfo: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/fxsh/getCurrentStateInfo.do',
		getNextState: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/fxsh/getNextState.do',
		getAuditNodeInfo: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/fxsh/getShztInfoByLcdm.do',
		getStuApplyList: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/fxsh/getStuApplyList.do',
		singleAudit: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/fxsh/singleAudit.do',
		recallApply: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/fxsh/recallSingleApply.do',
		getApplyAndAuditInfo: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/fxsh/getApplyAndAuditInfo.do',

    	getCurrentStateInfo: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsh/getCurrentStateInfo.do',
		getNextState: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsh/getNextState.do',
		getAuditNodeInfo: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsh/getShztInfoByLcdm.do',
		getStuApplyList: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsh/getStuApplyList.do',
        getJzgApplyList: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsh/getJzgApplyList.do',
		getStuRegisterDetail: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsh/getStuRegisterDetail.do',
        getJzgRegisterDetail: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsh/getJzgRegisterDetail.do',
        singleAudit: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsh/singleAudit.do',
        recallApply: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsh/recallSingleApply.do',
        changeToDraft: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsh/changeToDraft.do',
		getChangeToDraftAuth: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsh/getAddFuncAuth.do',
		getApplyAndAuditInfo: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsh/getApplyAndAuditInfo.do',
		getStuHealthList: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsh/getStuHealthList.do',
        getAuditInfo: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsh/getAuditInfo.do',
        statisticAuditRate: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsh/statisticAuditRate.do',
        checkInSpecialStuList: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsh/checkInSpecialStuList.do',
        getAuditStuDetail: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsh/getAuditStuDetail.do',
        getSdysZtInfo: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsh/getSdysZtInfo.do',
        queryAuitStuTravel: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsh/queryAuitStuTravel.do',
        getStuJkdaList: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsh/getStuJkdaList.do',
        getAuditDrqkDetail: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsh/getAuditDrqkDetail.do',
        saveTeaConfirm: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsh/saveTeaConfirm.do',
        getAuditUserDataAuth: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsh/getUserDataAuth.do',
        getStuXcxxList: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsh/getUserDataAuth.do',
        getTeaConfirmStuList: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsh/getTeaConfirmStuList.do',
        getFrontState: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxsh/getFrontState.do',

		getUserDataAuth: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxrytj/getUserDataAuth.do',
		getBackStatisticData: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxrytj/getBackStatisticData.do',
		getStuList:WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxrytj/getStuList.do',
		getYxBJ:WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxrytj/getYxBJ.do',
		
		
		getCheckInfo:WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/ryjjcx/getCheckInfo.do',
		queryGatherInfo:WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/ryjjcx/queryGatherInfo.do',
		getYxBJ:WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxrytj/getYxBJ.do',
		getPc:WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxrytj/getPc.do',
		getXslb:WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/fxrytj/getXslb.do',
		getCurrentDate:WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/dxsdtj/getCurrentDate.do',
		getXmData:WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/dxsdtj/getXmData.do',
		getSdRs:WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/dxsdtj/getSdRs.do',
		getTjStuData:WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/dxsdtj/getTjStuData.do',
		
		//交大校园码
		getMsgDetail: WIS_CONFIG.ROOT_PATH + '/sys/fxyqglapp/modules/healthRecords/queryYcyyDetail.do',
		
		//外出申请
		queryWcsqPageInfo: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/wcsq/queryWcsqPageInfo.do',
    	queryWcsqShlcInfo: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/wcsq/queryWcsqShlcInfo.do',
    	saveWcsqApply: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/wcsq/saveWcsqApply.do',
    	recallWcsqApply: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/wcsq/recallWcsqApply.do',
    	getWcsqList: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/wcsq/getWcsqList.do',
    	
    	//转码申请
    	queryZmsqPageInfo: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/zmsq/queryZmsqPageInfo.do',
    	saveZmsqApply: WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/zmsq/saveZmsqApply.do',
    	
    	//外出审核
		getStuSqwcList:WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/wcsh/getStuSqwcList.do',
		getWcshAuditNodeInfo:WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/wcsh/getWcshAuditNodeInfo.do',
		getWcshCurrentStateInfo:WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/wcsh/getWcshCurrentStateInfo.do',
		getStuDetailedSqxx:WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/wcsh/getStuDetailedSqxx.do',
		getWcsqAuditInfo:WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/wcsh/getAuditInfo.do',
		getWcsqNextState:WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/wcsh/getNextState.do',
		singleWcshAudit:WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/wcsh/singleWcshAudit.do',
		getWcshFrontState:WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/wcsh/getWcshFrontState.do',
		recallWcsh:WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/wcsh/recallWcsh.do',
		statisticWcsqAuditRate:WIS_CONFIG.ROOT_PATH + '/sys/swmfxyqglapp/modules/wcsh/statisticWcsqAuditRate.do',
    };
});
source "https://rubygems.org"

# Jekyll版本
gem "jekyll", "~> 4.3.0"

# GitHub Pages兼容
gem "github-pages", group: :jekyll_plugins

# Jekyll插件
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.12"
  gem "jekyll-sitemap"
  gem "jekyll-seo-tag"
  gem "jekyll-paginate"
  gem "jekyll-archives"
end

# Windows和JRuby平台支持
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", " ~> 1.2"
  gem "tzinfo-data"
end

# Windows性能优化
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]

# JRuby支持
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]